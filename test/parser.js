
var parsers = require('../lib/parser');

exports['Parse empty text'] = function (test) {
    var parser = parsers.parser('');
    
    var result = parser.parse();
    
    test.strictEqual(result, null);
}

exports['Parse integer'] = function (test) {
    var parser = parsers.parser('42');
    
    var result = parser.parse();
    
    test.ok(result);
    test.strictEqual(result, 42);
}

exports['Parse string'] = function (test) {
    var parser = parsers.parser('"foo"');
    
    var result = parser.parse();
    
    test.ok(result);
    test.strictEqual(result, "foo");
}

