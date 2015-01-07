
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
    var context = { currentns: 'user' };
    test.equal(compiler.compile(lists.create([symbols.symbol('def'), symbols.symbol('one'), 1]), context), 'user.one = 1');
    
    test.ok(context.nss);
    test.ok(context.nss.user.vars);
    test.ok(context.nss.user.vars.indexOf('one') >= 0);
};

exports['Compile symbol with qualified namespace'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('core.logic/first')), 'core.logic.first');
};

exports['Compile symbol in js namespace'] = function (test) {
    test.equal(compiler.compile(symbols.symbol('js/console')), 'console');
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

exports['Compile fn with rest of arguments'] = function (test) {
    test.equal(compile('(fn [x y & z] (list x y))'), 'function (x, y) { var z = makeRest(arguments, 2); return cljs.core.list.call(null, x, y); }');
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
    test.equal(compile('(if (nil? x) 1 2)', { locals: [ 'x' ] }), '(cljs.core.nil_P.call(null, x)) ? (1) : (2)');
};

exports['Compile let'] = function (test) {
    test.equal(compile('(let [x 1] (if x true false)'), '(function (x) { return (x) ? (true) : (false); })(1)');
    test.equal(compile('(let [x 1 y 2] (if x y 0)'), '(function (x) { return (function (y) { return (x) ? (y) : (0); })(2); })(1)');
    test.equal(compile('(let [x 1] 1 2 x)'), '(function (x) { return (1, 2, x); })(1)');
};

exports['Compile def'] = function (test) {
    test.equal(compile('(def one 1)'), 'cljs.core.one = 1');
    test.equal(compile('(def one (fn [x] (+ x 1)))'), 'cljs.core.one = function (x) { return (x) + (1); }');
    test.equal(compile('(def my-one (fn [x] (+ x 1)))'), 'cljs.core.my_HY_one = function (x) { return (x) + (1); }');
};

exports['Compile def in current ns'] = function (test) {
    test.equal(compile('(def one 1)', { currentns: 'user.core' }), 'user.core.one = 1');
};

exports['Compile add'] = function (test) {
    test.equal(compile('(+)'), '(0)');
    test.equal(compile('(+ 1)'), '(1)');
    test.equal(compile('(+ 1 2)'), '(1) + (2)');
    test.equal(compile('(+ 1 2 3)'), '(1) + (2) + (3)');
};

exports['Compile subtract'] = function (test) {
    test.equal(compile('(- 1)'), '-(1)');
    test.equal(compile('(- 1 2)'), '(1) - (2)');
    test.equal(compile('(- 1 2 3)'), '(1) - (2) - (3)');
};

exports['Compile comparisons'] = function (test) {
    test.equal(compile('(== 1 2)'), '(1) == (2)');
    test.equal(compile('(!= 1 2)'), '(1) != (2)');
    test.equal(compile('(=== 1 2)'), '(1) === (2)');
    test.equal(compile('(!== 1 2)'), '(1) !== (2)');
    test.equal(compile('(> 1 2)'), '(1) > (2)');
    test.equal(compile('(< 1 2)'), '(1) < (2)');
    test.equal(compile('(>= 1 2)'), '(1) >= (2)');
    test.equal(compile('(<= 1 2)'), '(1) <= (2)');
};

exports['Compile set!'] = function (test) {
    var context = { locals: ['x', 'y'] };
    test.equal(compile('(set! x 1)', context), 'x = 1');
    test.equal(compile('(set! v 2)', context), 'cljs.core.v = 2');
    test.equal(compile('(set! (. y length) (+ 1 2))', context), 'y.length = (1) + (2)');
};

exports['Compile quote'] = function (test) {
    test.equal(compile("'42"), '42');
    test.equal(compile("'x"), 'symbols.symbol("x")');
    test.equal(compile("'\"foo\""), '"foo"');
    test.equal(compile("'(1 2)"), 'lists.create([1, 2])');
};

exports['Compile backquote'] = function (test) {
    test.equal(compile("`42"), '42');
    test.equal(compile("`x"), 'symbols.symbol("x")');
    test.equal(compile("`(~x ~y)", { locals: ['x', 'y'] }), 'lists.create([x, y])');
    test.equal(compile("`(1 ~x ~@y 2 3)", { locals: ['x', 'y'] }), 'lists.create([1, x, ].concat(y == null ? [] : y.asArray()).concat([2, 3])])');
    test.equal(compile("`\"foo\""), '"foo"');
    test.equal(compile("`(1 2)"), 'lists.create([1, 2])');
    test.equal(compile("`[1 2]"), 'vectors.create([1, 2])');
    test.equal(compile("`[x y]"), 'vectors.create([symbols.symbol("x"), symbols.symbol("y")])');
    test.equal(compile("`[~x ~y]", { locals: [ 'x', 'y' ] }), 'vectors.create([x, y])');
};

