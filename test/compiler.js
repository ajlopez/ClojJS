
var compiler = require('../lib/compiler');
var symbols = require('../lib/symbol');
var lists = require('../lib/list');

exports['Compile integer'] = function (test) {
    test.strictEqual(compiler.compile(42), '42');
};

exports['Compile string'] = function (test) {
    test.strictEqual(compiler.compile("foo"), '"foo"');
};

exports['Compile null'] = function (test) {
    test.strictEqual(compiler.compile(null), 'null');
};

exports['Compile symbol in default namespace'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('first')), 'cljs.core.first');
};

exports['Compile local symbol'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('x'), { locals: [ 'x', 'y' ] }), 'x');
};

exports['Compile list'] = function (test) {
    test.equal(compiler.compile(lists.create([symbols.symbol('list'), 1, 2, 3])), 'cljs.core.list.call(null, 1, 2, 3)');
};

