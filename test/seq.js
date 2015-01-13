
var clojjs = require('..');
var lists = require('../lib/list');
var vectors = require('../lib/vector');

exports['seq nil'] = function (test) {
    test.equal(cljs.core.seq(null), null);
}

exports['seq empty list'] = function (test) {
    test.equal(cljs.core.seq(lists.emptyList), null);
}

exports['seq list'] = function (test) {
    var list = lists.create([1, 2, 3]);
    test.strictEqual(cljs.core.seq(list), list);
}

exports['seq vector'] = function (test) {
    var vector = vectors.create([1, 2, 3]);
    test.equal(cljs.core.seq(vector).asString(), "(1 2 3)");
}

exports['seq string'] = function (test) {
    test.equal(cljs.core.seq("foo").asString(), '("f" "o" "o")');
}

exports['seq native array'] = function (test) {
    test.equal(cljs.core.seq([1, 2, 3]).asString(), '(1 2 3)');
}

exports['seq throw error'] = function (test) {
    test.throws(
        function () {
            cljs.core.seq(42);
        },
        "Don't know how to create sequence from: 42"
    );
}
