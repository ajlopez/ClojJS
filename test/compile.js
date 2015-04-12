
var clojjs = require('..');
var symbols = require('../lib/symbol');
var lists = require('../lib/list');
var parsers = require('../lib/parser');

exports['Compile integer'] = function (test) {
    test.strictEqual(clojjs.compile('42'), '42');
};

exports['Compile string'] = function (test) {
    test.strictEqual(clojjs.compile('"foo"'), '"foo"');
};

exports['Compile nil'] = function (test) {
    test.strictEqual(clojjs.compile('nil'), 'null');
};

exports['Compile symbol in default namespace'] = function (test) {
    test.equal(clojjs.compile('first'), 'cljs.core.first');
};

exports['Compile symbol with namespace'] = function (test) {
    test.equal(clojjs.compile('ns/first'), 'ns.first');
};

exports['Compile def in default namespace'] = function (test) {
    test.ok(clojjs.compile('(def one 1)').indexOf('cljs.core.one = 1') >= 0);
};

exports['Compile def in current namespace'] = function (test) {
    var context = { currentns: 'user' };
    if (typeof user == 'undefined')
        user = { };
        
    test.ok(clojjs.compile('(def one 1)', context).indexOf('user.one = 1') >= 0);
    
    test.ok(context.nss);
    test.ok(context.nss.user.vars);
    test.ok(context.nss.user.vars.indexOf('one') >= 0);
};

exports['Compile symbol with qualified namespace'] = function (test) {
    test.equal(clojjs.compile('core.logic/first'), 'core.logic.first');
};

exports['Compile symbol in js namespace'] = function (test) {
    test.equal(clojjs.compile('js/console'), 'console');
};

exports['Compile native invoke with initial dot'] = function (test) {
    test.equal(clojjs.compile('(.log js/console (1 (+ 1 1)))'), 'console.log(1, (1) + (1))');
};

exports['Compile native invoke with initial dot and no arguments'] = function (test) {
    test.equal(clojjs.compile('(.toUpperCase "foo" ())'), '"foo".toUpperCase()');
};

exports['Compile native property with initial dot'] = function (test) {
    test.equal(clojjs.compile('(.length "foo")'), '"foo".length');
};

exports['Compile local symbol'] = function (test) {
    test.equal(clojjs.compile('x', { locals: [ 'x', 'y' ] }), 'x');
};

exports['Compile list'] = function (test) {
    test.equal(clojjs.compile('(list 1 2 3)'), 'cljs.core.list.call(null, 1, 2, 3)');
};

exports['Compile list with variables'] = function (test) {
    test.equal(clojjs.compile('(list a b c)'), 'cljs.core.list.call(null, cljs.core.a, cljs.core.b, cljs.core.c)');
};

exports['Compile fn'] = function (test) {
    test.equal(clojjs.compile('(fn [x y] (list x y))'), 'function (x, y) { return cljs.core.list.call(null, x, y); }');
};

exports['Compile fn with rest of arguments'] = function (test) {
    test.equal(clojjs.compile('(fn [x y & z] (list x y))'), 'function (x, y) { var z = makeRest(arguments, 2); return cljs.core.list.call(null, x, y); }');
};

exports['Compile fn with multiple arities'] = function (test) {
    test.equal(clojjs.compile('(fn ([x] (+ x 1)) ([x y] (+ x y)))'), 'function () { if (arguments.length == 1) return (function (x) { return (x) + (1); }).apply(null, arguments); if (arguments.length == 2) return (function (x, y) { return (x) + (y); }).apply(null, arguments); }');
    test.equal(clojjs.compile('(fn ([x] (+ x 1)) ([x y & z] (+ x y)))'), 'function () { if (arguments.length == 1) return (function (x) { return (x) + (1); }).apply(null, arguments); if (arguments.length >= 2) return (function (x, y) { var z = makeRest(arguments, 2); return (x) + (y); }).apply(null, arguments); }');
};

exports['Compile dot get property'] = function (test) {
    test.equal(clojjs.compile('(. "foo" length)'), '"foo".length');
};

exports['Compile dot invoke method'] = function (test) {
    test.equal(clojjs.compile('(. "foo" (substring 1))'), '"foo".substring(1)');
};

exports['Compile do'] = function (test) {
    test.equal(clojjs.compile('(do 1 2 3)'), '(1, 2, 3)');
};

exports['Compile if'] = function (test) {
    test.equal(clojjs.compile('(if true 1 2)'), '(true) ? (1) : (2)');
    test.equal(clojjs.compile('(if false 1)'), '(false) ? (1) : null');
    test.equal(clojjs.compile('(if (nil? x) 1 2)', { locals: [ 'x' ] }), '(cljs.core.nil_P.call(null, x)) ? (1) : (2)');
};

exports['Compile let'] = function (test) {
    test.equal(clojjs.compile('(let [x 1] (if x true false))'), '(function (x) { return (x) ? (true) : (false); })(1)');
    test.equal(clojjs.compile('(let [x 1 y 2] (if x y 0))'), '(function (x) { return (function (y) { return (x) ? (y) : (0); })(2); })(1)');
    test.equal(clojjs.compile('(let [x 1] 1 2 x)'), '(function (x) { return (1, 2, x); })(1)');
};

exports['Compile loop'] = function (test) {
    test.equal(clojjs.compile('(loop [x 1 y 2] (if x y 0))', {}), 'loops.evaluate(function (x) { return function (y) { return (x) ? (y) : (0); }; }, [1, 2])');
};

exports['Compile def'] = function (test) {
    test.ok(clojjs.compile('(def one 1)').indexOf('cljs.core.one = 1') >= 0);
    test.equal(cljs.core.one, 1);
    test.ok(clojjs.compile('(def one (fn [x] (+ x 1)))').indexOf('cljs.core.one = function (x) { return (x) + (1); }') >= 0);
    test.equal(typeof cljs.core.one, 'function');
    test.ok(clojjs.compile('(def my-one (fn [x] (+ x 1)))').indexOf('cljs.core.my_HY_one = function (x) { return (x) + (1); }') >= 0);
    test.equal(typeof cljs.core.my_HY_one, 'function');    
};

exports['Compile def in current ns'] = function (test) {
    if (typeof user.core == 'undefined')
        user.core = { };
        
    test.ok(clojjs.compile('(def one 1)', { currentns: 'user.core' }).indexOf('user.core.one = 1') >= 0);
};

exports['Compile add'] = function (test) {
    test.equal(clojjs.compile('(+)'), '(0)');
    test.equal(clojjs.compile('(+ 1)'), '(1)');
    test.equal(clojjs.compile('(+ 1 2)'), '(1) + (2)');
    test.equal(clojjs.compile('(+ 1 2 3)'), '(1) + (2) + (3)');
};

exports['Compile subtract'] = function (test) {
    test.equal(clojjs.compile('(- 1)'), '-(1)');
    test.equal(clojjs.compile('(- 1 2)'), '(1) - (2)');
    test.equal(clojjs.compile('(- 1 2 3)'), '(1) - (2) - (3)');
};

exports['Compile modulus'] = function (test) {
    test.equal(clojjs.compile('(% 1 2)'), '(1) % (2)');
};

exports['Compile comparisons'] = function (test) {
    test.equal(clojjs.compile('(= 1 2)'), 'cljs.core.equals.call(null, 1, 2)');
    test.equal(clojjs.compile('(!= 1 2)'), '(1) != (2)');
    test.equal(clojjs.compile('(== 1 2)'), '(1) == (2)');
    test.equal(clojjs.compile('(!= 1 2)'), '(1) != (2)');
    test.equal(clojjs.compile('(=== 1 2)'), '(1) === (2)');
    test.equal(clojjs.compile('(!== 1 2)'), '(1) !== (2)');
    test.equal(clojjs.compile('(> 1 2)'), '(1) > (2)');
    test.equal(clojjs.compile('(< 1 2)'), '(1) < (2)');
    test.equal(clojjs.compile('(>= 1 2)'), '(1) >= (2)');
    test.equal(clojjs.compile('(<= 1 2)'), '(1) <= (2)');
};

exports['Compile set!'] = function (test) {
    var context = { locals: ['x', 'y'] };
    test.equal(clojjs.compile('(set! x 1)', context), 'x = 1');
    test.equal(clojjs.compile('(set! v 2)', context), 'cljs.core.v = 2');
    test.equal(clojjs.compile('(set! (. y length) (+ 1 2))', context), 'y.length = (1) + (2)');
};

exports['Compile quote'] = function (test) {
    test.equal(clojjs.compile("'42"), '42');
    test.equal(clojjs.compile("'x"), 'symbols.symbol("x")');
    test.equal(clojjs.compile("'\"foo\""), '"foo"');
    test.equal(clojjs.compile("'(1 2)"), 'lists.create([1, 2])');
    test.equal(clojjs.compile("'[1 2]"), 'vectors.create([1, 2])');
};

exports['Compile vector'] = function (test) {
    test.equal(clojjs.compile("[1 2]"), 'vectors.create([1, 2])');
};

exports['Compile vector with variables'] = function (test) {
    test.equal(clojjs.compile("[a b]"), 'vectors.create([cljs.core.a, cljs.core.b])');
};

exports['Compile keyword'] = function (test) {
    test.equal(clojjs.compile(":foo"), 'keywords.keyword("foo")');
};

exports['Compile map'] = function (test) {
    test.equal(clojjs.compile("{ :one 1 :two 2 }"), 'maps.create([keywords.keyword("one"), 1, keywords.keyword("two"), 2])');
};

exports['Compile set'] = function (test) {
    test.equal(clojjs.compile("#{ 1 2 3 }"), 'sets.create([1, 2, 3])');
};

exports['Compile backquote'] = function (test) {
    test.equal(clojjs.compile("`42"), '42');
    test.equal(clojjs.compile("`x"), 'symbols.symbol("x")');
    test.equal(clojjs.compile("`(~x ~y)", { locals: ['x', 'y'] }), 'lists.create([x, y])');
    test.equal(clojjs.compile("`(1 ~x ~@y 2 3)", { locals: ['x', 'y'] }), 'lists.create([1, x, ].concat(asArray(y)).concat([2, 3]))');
    test.equal(clojjs.compile("`\"foo\""), '"foo"');
    test.equal(clojjs.compile("`(1 2)"), 'lists.create([1, 2])');
    test.equal(clojjs.compile("`[1 2]"), 'vectors.create([1, 2])');
    test.equal(clojjs.compile("`[x y]"), 'vectors.create([symbols.symbol("x"), symbols.symbol("y")])');
    test.equal(clojjs.compile("`[~x ~y]", { locals: [ 'x', 'y' ] }), 'vectors.create([x, y])');
};

exports['Compile native new with ending dot'] = function (test) {
    test.equal(clojjs.compile("(Date.)"), "new Date()");
    test.equal(clojjs.compile('(Error. "Invalid operation")'), 'new Error("Invalid operation")');
};

exports['Compile try'] = function (test) {
    test.equal(clojjs.compile("(try (divide 1 0) (catch Exception e (str \"caught exception: \" (.getMessage e ()))))"), "try { cljs.core.divide.call(null, 1, 0) } catch (e) { cljs.core.str.call(null, \"caught exception: \", e.getMessage()) }");
};
