
var clojjs = require('..');
var lists = require('../lib/list');

exports['Evaluate list'] = function (test) {
    test.equal(cljs.core.list(1, 2, 3).asString(), "(1 2 3)");
    test.equal(cljs.core.list(1, lists.create([2, 3]), 4).asString(), "(1 (2 3) 4)");
};

exports['Evaluate first'] = function (test) {
    test.equal(cljs.core.first(lists.create([1, 2, 3])), 1);
    test.equal(cljs.core.first(lists.create([2])), 2);
};

exports['Evaluate next'] = function (test) {
    test.equal(cljs.core.next(lists.create([1, 2, 3])).asString(), "(2 3)");
    test.equal(cljs.core.next(lists.create([2])), null);
};

exports['Evaluate cons'] = function (test) {
    test.equal(cljs.core.cons(1, lists.create([2, 3])).asString(), "(1 2 3)");
    test.equal(cljs.core.cons(1, lists.create([2])).asString(), "(1 2)");
};

exports['Execute core file'] = function (test) {
    test.ok(cljs.core.defmacro);
    test.ok(cljs.core.defmacro.macro);
    test.ok(cljs.core.defn);
    test.ok(cljs.core.defn.macro);

    test.ok(cljs.core.second);
    test.ok(cljs.core.ffirst);
    test.ok(cljs.core.nfirst);
    test.ok(cljs.core.fnext);
    test.ok(cljs.core.nnext);
    
    test.ok(cljs.core.println);
    test.ok(cljs.core.is);
};

exports['Evaluate second'] = function (test) {
    test.equal(clojjs.evaluate("(second '(1 2 3))"), 2);
    test.equal(clojjs.evaluate("(second '(1 (2 3) 4))").asString(), '(2 3)');
};

exports['Evaluate ffirst'] = function (test) {
    test.equal(clojjs.evaluate("(ffirst '((1) 2 3))"), 1);
    test.equal(clojjs.evaluate("(ffirst '((1 2) (2 3) 4))"), 1);
};

exports['Evaluate throw'] = function (test) {
    test.throws(
        function () {
            clojjs.evaluate('(throw (Error. "Throw Error"))');
        },
        "Throw Error"
    );
};

exports['Evaluate success is'] = function (test) {
    test.equal(clojjs.evaluate("(is (= 1 1))"), true);
    test.equal(clojjs.evaluate("(is (= 2 (+ 1 1)))"), true);
};

exports['Evaluate failed is'] = function (test) {
    test.throws(
        function () {
            clojjs.evaluate("(is (= 1 2))");
        },
        "Assert error: (= 1 2) is not true"
    );
};