
require('./core');

var parsers = require('./parser');
var compiler = require('./compiler');

function evaluate(text) {
    var parser = parsers.parser(text);
    var code = compiler.compile(parser.parse());
    return eval(code);
}

module.exports = {
    evaluate: evaluate
}