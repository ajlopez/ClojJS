
var compiler = require('../lib/compiler');
var symbols = require('../lib/symbol');
var lists = require('../lib/list');
var parsers = require('../lib/parser');

function compile(text, context) {
    var parser = parsers.parser(text);
    var expr = parser.parse();
    return compiler.compile(expr, context);
}

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

exports['Compile symbol with namespace'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('ns/first')), 'ns.first');
};

exports['Compile def in default namespace'] = function (test) {
    test.equal(compiler.compile(lists.create([symbols.symbol('def'), symbols.symbol('one'), 1])), 'cljs.core.one = 1');
};

exports['Compile def in current namespace'] = function (test) {
    test.equal(compiler.compile(lists.create([symbols.symbol('def'), symbols.symbol('one'), 1]), { currentns: 'user' }), 'user.one = 1');
};

exports['Compile symbol with qualified namespace'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('core.logic/first')), 'core.logic.first');
};

exports['Compile local symbol'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('x'), { locals: [ 'x', 'y' ] }), 'x');
};

exports['Compile list'] = function (test) {
    test.equal(compiler.compile(lists.create([symbols.symbol('list'), 1, 2, 3])), 'cljs.core.list.call(null, 1, 2, 3)');
};

exports['Compile fn'] = function (test) {
    test.equal(compile('(fn [x y] (list x y))'), 'function (x, y) { return cljs.core.list.call(null, x, y); }');
};

exports['Compile dot get property'] = function (test) {
    test.equal(compile('(. "foo" length'), '"foo".length');
};

exports['Compile dot invoke method'] = function (test) {
    test.equal(compile('(. "foo" (substring 1)'), '"foo".substring(1)');
};

exports['Compile do'] = function (test) {
    test.equal(compile('(do 1 2 3)'), '(1, 2, 3)');
};

exports['Compile if'] = function (test) {
    test.equal(compile('(if true 1 2)'), '(true) ? (1) : (2)');
    test.equal(compile('(if false 1)'), '(false) ? (1) : null');
    test.equal(compile('(if (nil? x) 1 2)', { locals: [ 'x' ] }), '(cljs.core.nil?.call(null, x)) ? (1) : (2)');
};

