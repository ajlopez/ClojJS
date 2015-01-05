
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
    var parser = parsers.parser(text);
    var result = null;
    var code = '';
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse())
        code += compiler.compile(expr) + ";\n";
        
    eval(code);
}

module.exports = {
    evaluate: evaluate,
    execute: execute
}