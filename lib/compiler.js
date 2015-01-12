
require('./core');

var symbols = require('./symbol');
var lists = require('./list');
var vectors = require('./vector');
var keywords = require('./keyword');
var maps = require('./map');

var comparisons = [ '==', '!=', '===', '!==', '<', '>', '<=', '>=', '<=', '>=' ];

function compile(value, context) {
    if (symbols.isSymbol(value))
        return resolve(value.name(), context);
        
    if (lists.isEmptyList(value))
        return compileEmptyList(value, context);
        
    if (lists.isList(value))
        return compileList(value, context);
        
    if (maps.isMap(value))
        return compileMap(value, context);
        
    if (vectors.isVector(value))
        return compileVector(value, context);

    if (keywords.isKeyword(value))
        return compileKeyword(value, context);
        
    return JSON.stringify(value);
}

function compileKeyword(keyword, context) {
    return keyword.asCode(compile, context);
}

function compileMap(map, context) {
    return map.asCode(compile, context);
}

function compileVector(vector, context) {
    return vector.asCode(compile, context);
}

function compileEmptyList(list, context) {
    return list.asCode(compile, context);
}

function compileList(list, context) {
    var first = list.first();
    
    if (symbols.isSymbol(first)) {
        var name = first.name();
        
        if (name == '=')
            name = 'equals';
        
        if (name == 'def')
            return compileDef(list.next().first().name(), list.next().next().first(), context);
            
        if (name == 'fn') {
            if (vectors.isVector(list.next().first()))
                return compileFn(list.next().first(), list.next().next(), context);
            
            return compileMultiFn(list.next(), context);
        }
            
        if (name == '.')
            return compileDot(list.next().first(), list.next().next().first(), context);
            
        if (name[0] == '.')
            return compileDotName(name.substring(1), list.next().first(), list.next().next().first(), context);
            
        if (name.length && name[name.length - 1] == '.')
            return compileNew(name.substring(0, name.length - 1), list.next(), context);
            
        if (name == 'do')
            return compileDo(list.next(), context);
            
        if (name == 'if')
            return compileIf(list.next().first(), list.next().next().first(), list.next().next().next() ? list.next().next().next().first() : null, context);
            
        if (name == 'let')
            return compileLet(list.next().first(), list.next().next(), context);

        if (name == 'loop')
            return compileLoop(list.next().first(), list.next().next(), context);

        if (name == 'set!')
            return compileSetBang(list.next().first(), list.next().next().first(), context);

        if (name == 'ns')
            return compileNs(list.next().first().name(), context);
            
        if (name == 'quote')
            return compileQuote(list.next().first(), context);
            
        if (name == 'backquote')
            return compileBackquote(list.next().first(), context);
            
        if (name == '+')
            return compileAdd(list.next(), context);

        if (name == '-')
            return compileSubtract(list.next(), true, context);
            
        if (comparisons.indexOf(name) >= 0)
            return compileComparison(name, list.next().first(), list.next().next().first(), context);
    }
    
    var hasctx = false;
    var ismacro = false;
    
    if (symbols.isSymbol(first) && name) {
        var fullname = compile(first, context);
        
        if (fullname.indexOf('.') > 0 && eval(fullname)) {
            ismacro = eval(fullname + '.macro');
            hasctx = eval(fullname + '.ctx');
        }
            
        if (ismacro) {
            var args = [];
            
            if (list.next())
                args = list.next().asArray();
                
            if (hasctx)
                args.push(context);
                
            return compile(eval(fullname).apply(null, args), context);
        }
            
        var result = fullname + ".call(null";
    }
    else
        var result = '(' + compile(first, context) + ").call(null";
    
    for (var item = list.next(); item != null; item = item.next())
        result += ", " + compile(item.first(), context);
    
    return result + ")";
}

function compileSetBang(target, expr, context) {
    return compile(target, context) + ' = ' + compile(expr, context);
}

function compileQuote(value, context) {
    if (value == null)
        return "null";
        
    if (value.asCode)
        return value.asCode();
        
    return JSON.stringify(value);
}

function compileBackquote(value, context) {
    if (value == null)
        return "null";
        
    if (value.asCode)
        return value.asCode(compile, context);
        
    return JSON.stringify(value);
}

function compileNew(name, list, context) {
    return 'new ' + name + compileDo(list, context);
}

function compileDo(list, context) {
    var result = '(';
    var nitem = 0;
    
    while (list) {    
        var item = list.first();
        
        if (nitem)
            result += ', ';
            
        result += compile(item, context);
        list = list.next();
        nitem++;
    }
    
    result += ')';
    
    return result;
}

function compileNs(name, context) {
    var result = '';
    
    var names = name.split('.');
    var nsname = '';
    
    for (var k = 0; k < names.length; k++) {
        if (k) {
            result += ";\n";
            nsname += '.';
        }
        
        nsname += names[k];
        
        result += "if (typeof " + nsname + " == 'undefined') " + nsname + " = {}";
    }
    
    context.currentns = name;
    
    if (context.currentfile && !context.currentfile.namespace)
        context.currentfile.namespace = name;
    
    makeNamespace(context, name);
    
    return result;
}

function makeNamespace(context, name) {
    if (!context)
        return;
        
    if (!context.nss)
        context.nss = { };

    if (!context.nss[name])
        context.nss[name] = { vars: [], macros: [] };
}

function compileComparison(oper, left, right, context) {
    if (oper == '=')
        oper = '==';
    return '(' + compile(left, context) + ') ' + oper + ' (' + compile(right, context) + ')';
}

function compileAdd(list, context) {
    if (list == null)
        return "(0)";
        
    if (list.next() == null)
        return '(' + compile(list.first(), context) + ')';
        
    return '(' + compile(list.first(), context) + ') + ' + compileAdd(list.next(), context);
}

function compileSubtract(list, first, context) {
    if (list.next() == null)
        if (first)
            return '-(' + compile(list.first(), context) + ')';
        else
            return '(' + compile(list.first(), context) + ')';
                
    return '(' + compile(list.first(), context) + ') - ' + compileSubtract(list.next(), false, context);
}

function compileLoop(bindings, body, context) {
    var result = 'loops.evaluate(';
    
    result += compilePartialLet(bindings, body, context);
    result += ', [';
    
    var values = bindings.asArray();
    
    for (var k = 1; k < values.length; k += 2) {
        if (k > 1)
            result += ', ';
        result += compile(values[k], context);
    }
    
    result += '])';
    
    return result;
}

function compilePartialLet(bindings, body, context) {
    var result = 'function (';
    
    var name;
    
    if (bindings.get)
        name = bindings.get(0).name();
    else
        name = bindings.first().name();
    
    result += name + ') { return ';
    
    var newcontext = withLocal(context, name);
    
    if (bindings.length() > 2)
        result += compilePartialLet(bindings.next().next(), body, newcontext);
    else if (body.next() != null)
        result += compile(lists.list(symbols.symbol('do'), body), newcontext);
    else
        result += compile(body.first(), newcontext);
        
    result += '; }';
        
    return result;
}

function compileLet(bindings, body, context) {
    var result = '(function (';
    
    var name;
    var value;
    
    if (bindings.get) {
        name = bindings.get(0).name();
        value = compile(bindings.get(1), context);
    }
    else {
        name = bindings.first().name();
        value = compile(bindings.next().first(1), context);
    }
    
    result += name + ') { return ';
    
    var newcontext = withLocal(context, name);
    
    if (bindings.length() > 2)
        result += compileLet(bindings.next().next(), body, newcontext);
    else if (body.next() != null)
        result += compile(lists.list(symbols.symbol('do'), body), newcontext);
    else
        result += compile(body.first(), newcontext);
        
    result += '; })(' + value + ')';
        
    return result;
}

function compileIf(cond, thenbody, elsebody, context) {
    var result = '(' + compile(cond, context) + ') ? (' + compile(thenbody, context) + ') : ';
    
    if (elsebody != null)
        result += '(' + compile(elsebody, context) + ')';
    else
        result += 'null';
        
    return result;
}

function compileDotName(name, target, args, context) {
    var result = compile(target, context) + "." + name + compileDo(args, context);
    
    return result;
}

function compileDot(target, name, context) {
    if (lists.isList(name)) {
        var list = name;
        var name = list.first().name();
        
        var result = compile(target, context) + "." + name + "(";
        var nitem = 0;
        
        for (var item = list.next(); item != null; item = item.next()) {
            var value = item.first();
            
            if (nitem)
                result += ", ";
                
            result += compile(value, context);
                
            nitem++;
        }
        
        result += ")";
        
        return result;
    }
    
    return compile(target, context) + "." + name.name();
}

function getCurrentNamespaceName(context) {
    if (!context || !context.currentns)
        return 'cljs.core';
        
    return context.currentns;
}

function compileDef(name, value, context) {
    name = nameToJS(name);
    
    var nsname = getCurrentNamespaceName(context);
    
    if (nsname) {        
        if (context) {
            makeNamespace(context, nsname);
            context.nss[nsname].vars.push(name);
        }

        name = nsname + '.' + name;
    }
           
    return name + ' = ' + compile(value, context);
}

function compileFn(args, body, context) {
    var result = 'function (';
    var names = [];
    var restname = null;
    
    for (var k = 0; k < args.length(); k++) {
        var name = args.get(k).name();
        
        if (name == '&') {
            restname = args.get(k + 1).name();
            break;
        }
        
        if (k)
            result += ', ';
            
        result += name;
        names.push(name);
    }
    
    var newcontext = withLocals(context, names);
    
    result += ") {";
    
    if (restname) {
        newcontext = withLocal(newcontext, restname);
        result += " var " + restname + " = makeRest(arguments, " + names.length + ");";
    }
    
    if (body.length() >= 2)
        result += " return " + compileDo(body, newcontext) + "; }";
    else
        result += " return " + compile(body.first(), newcontext) + "; }";
    
    return result;
}

function compileMultiFn(options, context) {
    var result = 'function () { ';
    
    var opts = options.asArray();
    
    opts.forEach(function (opt) {
        var arity = opt.first().length();
        
        if (arity >= 2 && opt.first().get(arity - 2).name() == '&')
            result += 'if (arguments.length >= ' + (arity - 2) + ')';
        else
            result += 'if (arguments.length == ' + arity + ')';
            
        result += ' return (' + compileFn(opt.first(), opt.next(), context) + ').apply(null, arguments); ';
    });
    
    result += '}';
    
    return result;
}

function withLocal(context, name) {
    return withLocals(context, [name]);
}

function withLocals(context, names) {
    var newcontext = { };
    
    for (n in context)
        newcontext[n] = context[n];
        
    if (newcontext.locals == null)
        newcontext.locals = names;
    else
        newcontext.locals = newcontext.locals.concat(names);
        
    return newcontext;
}

function nameToJS(name) {
   name = name.replace('->', '_ARROW');
   name = name.replace('?', '_P');
   name = name.replace('!', '_BANG');
   name = name.replace(/-/g, '_HY_');
   
   return name;
}

function resolve(name, context) {
    if (name == '=')
        return 'cljs.core.equals';
        
    var pos = name.indexOf('/');
    
    if (pos == 2 && name.substring(0, 3) == 'js/')
        return name.substring(3);
    
    if (pos > 0)
        return name.replace('/', '.');
        
    name = nameToJS(name);
        
    if (context && context.locals && context.locals.indexOf(name) >= 0)
        return name;
        
    var fullname = getCurrentNamespaceName(context) + '.' + name;
    
    if (eval("typeof " + fullname + " != 'undefined'"))
        return fullname;
        
    var fullname2 = 'cljs.core.' + name;

    if (eval("typeof " + fullname2 + " != 'undefined'"))
        return fullname2;
        
    return fullname;
}

module.exports = {
    compile: compile
};