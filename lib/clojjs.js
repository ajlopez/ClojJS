
require('./core');

var parsers = require('./parser');
var compiler = require('./compiler');

function evaluate(text) {
    var parser = parsers.parser(text);
    var result = null;
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse()) 
        result = eval(compiler.compile(expr));
        
    return result;
}

module.exports = {
    evaluate: evaluate
}