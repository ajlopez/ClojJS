
var symbols = require('./symbol');

function compile(value, context) {
    if (symbols.isSymbol(value))
        return resolve(value.name(), context);
        
    return JSON.stringify(value);
}

function resolve(name, context) {
    if (context && context.locals && context.locals.indexOf(name) >= 0)
        return name;
        
    return 'cljs.core.' + name;
}

module.exports = {
    compile: compile
};