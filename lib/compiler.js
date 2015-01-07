
require('./core');

var symbols = require('./symbol');
var lists = require('./list');

var comparisons = [ '==', '!=', '===', '!==', '<', '>', '<=', '>=', '<=', '>=' ];

function compile(value, context) {
    if (symbols.isSymbol(value))
        return resolve(value.name(), context);
        
    if (lists.isList(value))
        return compileList(value, context);
        
    return JSON.stringify(value);
}

function compileList(list, context) {
    var first = list.first();
    
    if (symbols.isSymbol(first)) {
        var name = first.name();
        
        if (name == 'def')
            return compileDef(list.next().first().name(), list.next().next().first(), context);
            
        if (name == 'fn')
            return compileFn(list.next().first(), list.next().next().first(), context);
            
        if (name == '.')
            return compileDot(list.next().first(), list.next().next().first(), context);
            
        if (name == 'do')
            return compileDo(list.next(), context);
            
        if (name == 'if')
            return compileIf(list.next().first(), list.next().next().first(), list.next().next().next() ? list.next().next().next().first() : null, context);
            
        if (name == 'let')
            return compileLet(list.next().first(), list.next().next(), context);

        if (name == 'set!')
            return compileSetBang(list.next().first(), list.next().next().first(), context);

        if (name == 'ns')
            return compileNs(list.next().first().name(), context);
            
        if (name == 'quote')
            return compileQuote(list.next().first(), context);
            
        if (name == '+')
            return compileAdd(list.next(), context);

        if (name == '-')
            return compileSubtract(list.next(), true, context);
            
        if (comparisons.indexOf(name) >= 0)
            return compileComparison(name, list.next().first(), list.next().next().first(), context);
    }
    
    if (symbols.isSymbol(first) && name) {
        var fullname = compile(first, context);
        var ismacro = false;
        
        if (fullname.indexOf('.') > 0 && eval(fullname))
            ismacro = eval(fullname + '.macro');
            
        if (ismacro) {
            var args = [];
            
            if (list.next())
                args = list.next().asArray();
                
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

function compileLet(bindings, body, context) {
    var result = '(function (';
    
    var name = bindings.get(0).name();
    var value = compile(bindings.get(1), context);
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
    var nsname = getCurrentNamespaceName(context);
    
    if (nsname) {        
        if (context) {
            makeNamespace(context, nsname);
            context.nss[nsname].vars.push(name);
        }

        name = nsname + '.' + name;
    }
           
    return name + ' = ' + compile(value);
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
        
    result += " return " + compile(body, newcontext) + "; }";
    
    return result;
}

function withLocal(context, name) {
    return withLocals(context, [name]);
}

function withLocals(context, names) {
    var newcontext = { };
    
    if (context != null)
        for (n in context)
            newcontext[n] = context[n];
        
    if (newcontext.locals == null)
        newcontext.locals = names;
    else
        newcontext.locals = newcontext.locals.concat(names);
        
    return newcontext;
}

function resolve(name, context) {
    var pos = name.indexOf('/');
    
    if (pos == 2 && name.substring(0, 3) == 'js/')
        return name.substring(3);
    
    if (pos > 0)
        return name.replace('/', '.');
        
    name = name.replace('?', '_P');
    name = name.replace('!', '_BANG');
        
    if (context && context.locals && context.locals.indexOf(name) >= 0)
        return name;
        
    return 'cljs.core.' + name;
}

module.exports = {
    compile: compile
};