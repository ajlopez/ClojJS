
var symbols = require('../lib/symbol');

exports['Create symbol'] = function (test) {
    var symbol = symbols.symbol('foo');
    
    test.ok(symbol);
    test.equal(symbol.name(), 'foo');
    test.equal(symbol.asString(), 'foo');
};

