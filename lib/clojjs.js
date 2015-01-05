
require('./core');

var parsers = require('./parser');
var compiler = require('./compiler');

function evaluate(text) {
    var parser = parsers.parser(text);
    var result = null;
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse()) {
        var code = compiler.compile(expr);
        result = eval(code);
    }
        
    return result;
}

function execute(text) {
    evaluate(text);
}

module.exports = {
    evaluate: evaluate,
    execute: execute
}