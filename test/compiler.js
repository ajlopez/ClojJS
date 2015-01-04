
var compiler = require('../lib/compiler');

exports['Compile integer'] = function (test) {
    test.strictEqual(compiler.compile(42), '42');
};

exports['Compile string'] = function (test) {
    test.strictEqual(compiler.compile("foo"), '"foo"');
};

exports['Compile null'] = function (test) {
    test.strictEqual(compiler.compile(null), 'null');
};

