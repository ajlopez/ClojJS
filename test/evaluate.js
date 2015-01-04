
var clojjs = require('..');

exports['Evaluate integer'] = function (test) {
    var result = clojjs.evaluate('42');

    test.strictEqual(result, 42);
}

exports['Evaluate string'] = function (test) {
    var result = clojjs.evaluate('"foo"');

    test.strictEqual(result, "foo");
}

exports['Evaluate list'] = function (test) {
    var result = clojjs.evaluate('(list 1 2 3)');

    test.ok(result);
    test.equal(result.asString(), "(1 2 3)");
}

