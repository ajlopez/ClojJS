
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
    context = context || {};
    
    if (!context.locals)
        context.locals = [];
        
    var oldlocals = context.locals;
    context.locals = context.locals.slice();
    
    var result = 'function (';
    
    for (var k = 0; k < args.length(); k++) {
        if (k)
            result += ', ';
            
        var name = args.get(k).name();
        result += name;
        context.locals.push(name);
    }
    
    result += ") { return " + compile(body, context) + "; }";
    
    context.locals = context.oldlocals;
    
    return result;
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