
var clojjs = require('..');
var maps = require('../lib/map');
var sets = require('../lib/set');
var keywords = require('../lib/keyword');

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

exports['Evaluate dot'] = function (test) {
    test.equal(clojjs.evaluate('(. "foo" length)'), 3);
    test.equal(clojjs.evaluate('(. "foo" (substring 1))'), "oo");
    test.equal(clojjs.evaluate('(. "foo" (toUpperCase))'), "FOO");
}

exports['Evaluate do'] = function (test) {
    test.equal(clojjs.evaluate('(do 1 2 3)'), 3);
}

exports['Evaluate if'] = function (test) {
    test.equal(clojjs.evaluate('(if true 1 2)'), 1);
    test.equal(clojjs.evaluate('(if false 1 2)'), 2);
    test.equal(clojjs.evaluate('(if false 1)'), null);
}

exports['Evaluate add'] = function (test) {
    test.equal(clojjs.evaluate('(+)'), 0);
    test.equal(clojjs.evaluate('(+ 2)'), 2);
    test.equal(clojjs.evaluate('(+ 1 2)'), 3);
    test.equal(clojjs.evaluate('(+ 1 2 3)'), 6);
}

exports['Evaluate subtract'] = function (test) {
    test.equal(clojjs.evaluate('(- 2)'), -2);
    test.equal(clojjs.evaluate('(- 1 2)'), -1);
    test.equal(clojjs.evaluate('(- 1 2 3)'), -4);
}

exports['Evaluate let'] = function (test) {
    test.equal(clojjs.evaluate('(let [x 1] x)'), 1);
    test.equal(clojjs.evaluate('(let [x 1 y 2] x)'), 1);
    test.equal(clojjs.evaluate('(let [x 1 y 2] y)'), 2);
}

exports['Evaluate comparisons'] = function (test) {
    test.equal(clojjs.evaluate('(== 1 2)'), false);
    test.equal(clojjs.evaluate('(!= 1 2)'), true);
    test.equal(clojjs.evaluate('(=== 1 2)'), false);
    test.equal(clojjs.evaluate('(!== 1 2)'), true);
    test.equal(clojjs.evaluate('(< 1 2)'), true);
    test.equal(clojjs.evaluate('(> 1 2)'), false);
    test.equal(clojjs.evaluate('(<= 1 2)'), true);
    test.equal(clojjs.evaluate('(>= 1 2)'), false);
}

exports['Evaluate rest of arguments'] = function (test) {
    test.equal(clojjs.evaluate('((fn [x & y] y) 1 2)').asString(), "(2)");
    test.equal(clojjs.evaluate('((fn [x & y] y) 1)'), null);
    test.equal(clojjs.evaluate('((fn [x y & z] z) 1 2 3 4)').asString(), "(3 4)");
    test.equal(clojjs.evaluate('((fn [& x] x) 1 2 3 4)').asString(), "(1 2 3 4)");
}

exports['Evaluate multi arity fns'] = function (test) {
    test.equal(clojjs.evaluate('((fn ([x] x) ([x y] (+ x y))) 1 2)'), 3);
    test.equal(clojjs.evaluate('((fn ([x] x) ([x y] (+ x y))) 1 )'), 1);
    test.equal(clojjs.evaluate('((fn ([x] x) ([x y] (+ x y)) ([x y & z] z)) 1 2 3 4 )').asString(), '(3 4)');
    test.equal(clojjs.evaluate('((fn ([x] x) ([x y] (+ x y))) 1 2 3)'), null);
}

exports['Evaluate map to object'] = function (test) {
    var result = clojjs.evaluate('(to-object { :one 1 :two 2 :three 3 })');
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.one, 1);
    test.equal(result.two, 2);
    test.equal(result.three, 3);
}

exports['Evaluate map'] = function (test) {
    var result = clojjs.evaluate('{ :one 1 :two 2 :three 3 }');
    
    test.ok(result);
    test.ok(maps.isMap(result));
    test.equal(result.get(keywords.keyword('one')), 1);
    test.equal(result.get(keywords.keyword('two')), 2);
    test.equal(result.get(keywords.keyword('three')), 3);
}

exports['Evaluate set'] = function (test) {
    var result = clojjs.evaluate('#{ 1 2 3 }');
    
    test.ok(result);
    test.ok(sets.isSet(result));
    test.ok(result.has(1));
    test.ok(result.has(2));
    test.ok(result.has(3));
}

exports['Evaluate str'] = function (test) {
    test.equal(clojjs.evaluate('(str)'), '');
    test.equal(clojjs.evaluate('(str 1)'), '1');
    test.equal(clojjs.evaluate('(str 4 2)'), '42');
    test.equal(clojjs.evaluate('(str "foo")'), "foo");
    test.equal(clojjs.evaluate("(str '(1 2 3))"), "(1 2 3)");
    test.equal(clojjs.evaluate("(str '[1 2 3])"), "[1 2 3]");
    test.equal(clojjs.evaluate("(str [1 2 3])"), "[1 2 3]");
    test.equal(clojjs.evaluate("(str :foo :bar)"), ":foo:bar");
    test.equal(clojjs.evaluate("(str 'x)"), "x");
}