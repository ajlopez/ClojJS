
var lists = require('../lib/list');
var vectors = require('../lib/vector');
var utils = require('../lib/utils');

exports['Create list'] = function (test) {
    var list = lists.list(1, null);
    
    test.ok(list);
    test.strictEqual(list.first(), 1);
    test.strictEqual(list.next(), null);
};

exports['Lists as string'] = function (test) {
    test.equal(lists.list(1, null).asString(), "(1)");
    test.equal(lists.list(1, lists.list(2, null)).asString(), "(1 2)");
    test.equal(lists.create([1, lists.create([2, 3]), 4]).asString(), "(1 (2 3) 4)");
    test.equal(lists.create([1, vectors.create([2, 3]), 4]).asString(), "(1 [2 3] 4)");
    test.equal(lists.list(true, lists.list(false, null)).asString(), "(true false)");
};

exports['Is list'] = function (test) {
    test.ok(lists.isList(lists.list(1, null)));
    test.ok(lists.isList(lists.list(1, lists.list(2, null))));
    test.ok(!lists.isList(null));
    test.ok(!lists.isList(false));
    test.ok(!lists.isList(true));
    test.ok(!lists.isList(42));
    test.ok(!lists.isList("foo"));
};

exports['Equals'] = function (test) {
    test.ok(utils.equals(lists.create([1,2,3,4]), lists.create([1,2,3,4])));
};