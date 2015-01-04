
var core = require('../lib/core');
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

