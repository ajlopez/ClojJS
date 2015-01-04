
var symbols = require('../lib/symbol');

exports['Create symbol'] = function (test) {
    var symbol = symbols.symbol('foo');
    
    test.ok(symbol);
    test.equal(symbol.name(), 'foo');
    test.equal(symbol.asString(), 'foo');
};

exports['Is symbol'] = function (test) {
    var symbol = symbols.symbol('foo');
    
    test.ok(symbols.isSymbol(symbol));
    test.ok(!symbols.isSymbol(null));
    test.ok(!symbols.isSymbol(true));
    test.ok(!symbols.isSymbol(false));
    test.ok(!symbols.isSymbol(42));
    test.ok(!symbols.isSymbol('foo'));
};

