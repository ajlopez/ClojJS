
var symbols = require('./symbol');
var lists = require('./list');

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
            
        if (name  == 'fn')
            return compileFn(list.next().first(), list.next().next().first(), context);
            
        if (name  == '.')
            return compileDot(list.next().first(), list.next().next().first(), context);
            
        if (name  == 'do')
            return compileDo(list.next(), context);
            
        if (name  == 'if')
            return compileIf(list.next().first(), list.next().next().first(), list.next().next().next() ? list.next().next().next().first() : null, context);
            
        if (name  == 'let')
            return compileLet(list.next().first(), list.next().next(), context);
            
        if (name  == '+')
            return compileAdd(list.next(), context);

        if (name  == '-')
            return compileSubtract(list.next(), true, context);
    }
    
    var result = compile(first, context) + ".call(null";
    
    for (var item = list.next(); item != null; item = item.next())
        result += ", " + compile(item.first(), context);
        
    return result + ")";
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

function compileDef(name, value, context) {
    if (!context || !context.currentns)
        name = 'cljs.core.' + name;
    else
        name = context.currentns + '.' + name;
        
    return name + ' = ' + compile(value);
}

function compileFn(args, body, context) {
    var result = 'function (';
    var names = [];
    
    for (var k = 0; k < args.length(); k++) {
        if (k)
            result += ', ';
            
        var name = args.get(k).name();
        result += name;
        names.push(name);
    }
    
    var newcontext = withLocals(context, names);
    
    result += ") { return " + compile(body, newcontext) + "; }";
    
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
    if (name.indexOf('/') > 0)
        return name.replace('/', '.');
        
    if (context && context.locals && context.locals.indexOf(name) >= 0)
        return name;
        
    return 'cljs.core.' + name;
}

module.exports = {
    compile: compile
};