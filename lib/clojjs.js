
require('./core');

var parsers = require('./parser');
var compiler = require('./compiler');
var lists = require('./list');

function makeRest(args, n) {
    if (!args || args.length <= n)
        return null;
        
    var result = [];
    
    for (var k = n; k < args.length; k++)
        result.push(args[k]);
    
    return lists.create(result);
}

function evaluate(text) {
    var parser = parsers.parser(text);
    var result = null;
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse()) {
        var code = compiler.compile(expr);
        result = eval(code);
    }
        
    return result;
}

function execute(text, context) {
    var parser = parsers.parser(text);
    var result = null;
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse())
        eval(compiler.compile(expr, context) + ";\n");
}

module.exports = {
    evaluate: evaluate,
    execute: execute
}