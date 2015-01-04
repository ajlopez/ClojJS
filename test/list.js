
var lists = require('../lib/list');

exports['Create list'] = function (test) {
    var list = lists.list(1, null);
    
    test.ok(list);
    test.strictEqual(list.first(), 1);
    test.strictEqual(list.next(), null);
};

exports['Lists as string'] = function (test) {
    test.equal(lists.list(1, null).asString(), "(1)");
    test.equal(lists.list(1, lists.list(2, null)).asString(), "(1 2)");
    test.equal(lists.list(true, lists.list(false, null)).asString(), "(true false)");
};

