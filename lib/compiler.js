
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
    
    if (symbols.isSymbol(first) && first.name() == 'def')
        return compileDef(list.next().first().name(), list.next().next().first(), context);
    
    var result = compile(first) + ".call(null";
    
    for (var item = list.next(); item != null; item = item.next())
        result += ", " + compile(item.first());
        
    return result + ")";
}

function compileDef(name, value, context) {
    if (!context || !context.currentns)
        name = 'cljs.core.' + name;
    else
        name = context.currentns + '.' + name;
        
    return name + ' = ' + compile(value);
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