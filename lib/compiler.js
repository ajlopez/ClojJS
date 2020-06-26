
require('./core');

const symbols = require('./symbol');
const lists = require('./list');
const vectors = require('./vector');
const keywords = require('./keyword');
const maps = require('./map');
const sets = require('./set');

const comparisons = [ '==', '!=', '===', '!==', '<', '>', '<=', '>=', '<=', '>=' ];

function compile(value, context) {
    if (symbols.isSymbol(value)) {
        let name = value.name();
        
        if (name === '<')
            name = 'less';
        else if (name === '>')
            name = 'greater';
        else if (name === '<=')
            name = 'lessEqual';
        else if (name === '>=')
            name = 'greaterEqual';
            
        return resolve(name, context);
    }
        
    if (lists.isEmptyList(value))
        return compileEmptyList(value, context);
        
    if (lists.isList(value))
        return compileList(value, context);
        
    if (sets.isSet(value))
        return compileSet(value, context);
        
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

function compileSet(set, context) {
    return set.asCode(compile, context);
}

function compileMap(map, context) {
    return map.asCode(compile, context);
}

function compileVector(vector, context) {
    let result = 'vectors.create([';
    const items = vector.asArray();
            
    for (let k = 0; k < items.length; k++) {
        if (k)
            result += ', ';
            
        result += compile(items[k], context);
    }
        
    return result + '])';
}

function compileEmptyList(list, context) {
    return list.asCode(compile, context);
}

function compileList(list, context) {
    const first = list.first();
    let name;
    
    if (symbols.isSymbol(first)) {
        name = first.name();
        
        if (name === '=')
            name = 'equals';
        
        if (name === 'def')
            return compileDef(list.next().first().name(), list.next().next().first(), context);

        if (name === 'try')
            return compileTry(list.next().first(), list.next().next().first(), context);
            
        if (name === 'fn') {
            if (typeof list.next().first() === 'string')
                list = list.next();
            if (vectors.isVector(list.next().first()))
                return compileFn(list.next().first(), list.next().next(), context);
            
            return compileMultiFn(list.next(), context);
        }
            
        if (name === '.')
            return compileDot(list.next().first(), list.next().next().first(), context);
            
        if (name[0] === '.')
            if (list.next().next() == null)
                return compileDotName(name.substring(1), list.next().first(), null, context);
            else
                return compileDotName(name.substring(1), list.next().first(), list.next().next().first(), context);
            
        if (name.length && name[name.length - 1] === '.')
            return compileNew(name.substring(0, name.length - 1), list.next(), context);
            
        if (name === 'do')
            return compileDo(list.next(), context);
            
        if (name == 'if')
            return compileIf(list.next().first(), list.next().next().first(), list.next().next().next() ? list.next().next().next().first() : null, context);
            
        if (name === 'let')
            return compileLet(list.next().first(), list.next().next(), context);

        if (name === 'loop')
            return compileLoop(list.next().first(), list.next().next(), context);

        if (name === 'set!')
            return compileSetBang(list.next().first(), list.next().next().first(), context);

        if (name === 'ns')
            return compileNs(list.next().first().name(), context);
            
        if (name === 'quote')
            return compileQuote(list.next().first(), context);
            
        if (name === 'backquote')
            return compileBackquote(list.next().first(), context);
            
        if (name === '+')
            return compileAdd(list.next(), context);

        if (name === '-')
            return compileSubtract(list.next(), true, context);

        if (name === '%')
            return compileModulus(list.next(), context);
            
        if (comparisons.indexOf(name) >= 0)
            return compileComparison(name, list.next().first(), list.next().next().first(), context);
    }
    
    let hasctx = false;
    let ismacro = false;
    let result;
    
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
            
        result = fullname + ".call(null";
    }
    else
        result = '(' + compile(first, context) + ").call(null";
    
    for (let item = list.next(); item != null; item = item.next())
        result += ", " + compile(item.first(), context);
    
    return result + ")";
}

function compileTry(body, ctch, context) {
    const result = "try { " + compile(body, context) + " } catch (" + ctch.next().next().first().name() + ") { " + compile(ctch.next().next().next().first(), withLocal(context, ctch.next().next().first().name())) + " }";
    return result;
}

function compileSetBang(target, expr, context) {
    let lexpr = compile(target, context);
    
    if (lexpr && lexpr.length > 6 && lexpr.substring(lexpr.length - 6) === '.macro')
        lexpr = "//@@\n" + lexpr;
    
    var code = lexpr + ' = ' + compile(expr, context);
    
    return code;
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
    let result = '(';
    let nitem = 0;
    
    while (list) {    
        const item = list.first();
        
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
    let result = '//@@\n';
    
    const names = name.split('.');
    let nsname = '';
    
    for (let k = 0; k < names.length; k++) {
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
    if (oper === '=')
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

function compileModulus(list, context) {
    return '(' + compile(list.first(), context) + ') % (' + compile(list.next().first(), context) + ')';
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
    let result = 'loops.evaluate(';
    
    result += compilePartialLet(bindings, body, context);
    result += ', [';
    
    const values = bindings.asArray();
    
    for (let k = 1; k < values.length; k += 2) {
        if (k > 1)
            result += ', ';
        
        result += compile(values[k], context);
    }
    
    result += '])';
    
    return result;
}

function compilePartialLet(bindings, body, context) {
    let result = 'function (';
    let name;
    
    if (bindings.get)
        name = bindings.get(0).name();
    else
        name = bindings.first().name();
    
    result += name + ') { return ';
    
    const newcontext = withLocal(context, name);
    
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
    let result = '(function (';
    
    let name;
    let value;
    
    if (bindings.get) {
        name = bindings.get(0).name();
        value = compile(bindings.get(1), context);
    }
    else {
        name = bindings.first().name();
        value = compile(bindings.next().first(1), context);
    }
    
    result += name + ') { return ';
    
    const newcontext = withLocal(context, name);
    
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
    let result = '(' + compile(cond, context) + ') ? (' + compile(thenbody, context) + ') : ';
    
    if (elsebody != null)
        result += '(' + compile(elsebody, context) + ')';
    else
        result += 'null';
        
    return result;
}

function compileDotName(name, target, args, context) {
    let result;
    
    if (args == null)
        result = compile(target, context) + "." + name;
    else if (lists.isEmptyList(args))
        result = compile(target, context) + "." + name + "()";
    else
        result = compile(target, context) + "." + name + compileDo(args, context);
    
    return result;
}

function compileDot(target, name, context) {
    if (lists.isList(name)) {
        const list = name;
        name = list.first().name();
        
        let result = compile(target, context) + "." + name + "(";
        let nitem = 0;
        
        for (let item = list.next(); item != null; item = item.next()) {
            const value = item.first();
            
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
    
    const nsname = getCurrentNamespaceName(context);
    
    if (nsname) {        
        if (context) {
            makeNamespace(context, nsname);
            context.nss[nsname].vars.push(name);
        }

        name = nsname + '.' + name;
    }
    
    if (name.indexOf('.') > 0)
        name = '//@@\n' + name; // mark as executable at compile time
           
    return name + ' = ' + compile(value, context);
}

function compileFn(args, body, context) {
    const fnresult = compileFnNoRecur(args, body, context);
    
    if (!body.containsSymbol('recur') || body.containsSymbol('loop'))
        return fnresult;
        
    let result = 'function (';
    
    for (let k = 0; k < args.length(); k++) {
        const name = args.get(k).name();
        
        if (k)
            result += ', ';
            
        result += name;
    }
    
    result += ") { while (true) { var $result = (" + fnresult + ")(";    
    
    for (let k = 0; k < args.length(); k++) {
        const name = args.get(k).name();
        
        if (k)
            result += ', ';
            
        result += name;
    }
    
    result += "); if (!recurs.isRecur($result)) return $result; var $items = $result.items();";
    
    for (let k = 0; k < args.length(); k++) {
        const name = args.get(k).name();
        
        result += " " + name + " = $items[" + k + "];";
    }
    
    result += " }}";
    
    return result;
}

function compileFnNoRecur(args, body, context) {
    let result = 'function (';
    const names = [];
    let restname = null;
    
    for (let k = 0; k < args.length(); k++) {
        const name = args.get(k).name();
        
        if (name == '&') {
            restname = args.get(k + 1).name();
            break;
        }
        
        if (k)
            result += ', ';
            
        result += name;
        names.push(name);
    }
    
    let newcontext = withLocals(context, names);
    
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
    let result = 'function () { ';
    
    const opts = options.asArray();
    
    opts.forEach(function (opt) {
        const arity = opt.first().length();
        
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
    const newcontext = { };
    
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
       
    if (name[name.length - 1] === '?')
        name = name.substring(0, name.length - 1) + '_P';
    if (name[name.length - 1] === '!')
        name = name.substring(0, name.length - 1) + '_BANG';
    if (name[name.length - 1] === '=')
        name = name.substring(0, name.length - 1) + '_EQ';
    if (name[name.length - 1] === '*')
        name = name.substring(0, name.length - 1) + '_ASTER';
        
    name = name.replace(/-/g, '_HY_');
       
    return name;
}

function resolve(name, context) {
    if (name === '=')
        return 'cljs.core.equals';
        
    var pos = name.indexOf('/');
    
    if (pos === 2 && name.substring(0, 3) === 'js/')
        return name.substring(3);
    
    if (pos > 0)
        return name.replace('/', '.');
        
    name = nameToJS(name);
        
    if (context && context.locals && context.locals.indexOf(name) >= 0)
        return name;
        
    const fullname = getCurrentNamespaceName(context) + '.' + name;
    
    if (eval("typeof " + fullname + " != 'undefined'"))
        return fullname;
        
    const fullname2 = 'cljs.core.' + name;

    if (eval("typeof " + fullname2 + " != 'undefined'"))
        return fullname2;
        
    return fullname;
}

module.exports = {
    compile: compile
};

