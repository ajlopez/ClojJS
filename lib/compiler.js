
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
    var result = compile(list.first()) + ".call(null";
    
    for (var item = list.next(); item != null; item = item.next())
        result += ", " + compile(item.first());
        
    return result + ")";
}

function resolve(name, context) {
    if (context && context.locals && context.locals.indexOf(name) >= 0)
        return name;
        
    return 'cljs.core.' + name;
}

module.exports = {
    compile: compile
};