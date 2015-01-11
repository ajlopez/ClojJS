
var recurs = require('../lib/recur');
var lists = require('../lib/list');

exports['Create recur'] = function (test) {
    var result = recurs.create([1, 2, 3]);
    
    test.ok(result);
    test.equal(result.length(), 3);
    test.equal(result.get(0), 1);
    test.equal(result.get(1), 2);
    test.equal(result.get(2), 3);
    
    test.deepEqual(result.items(), [1, 2, 3]);
}

exports['Is recur'] = function (test) {
    var result = recurs.create([1, 2, 3]);
    
    test.ok(result);
    test.ok(recurs.isRecur(result));
    test.ok(!recurs.isRecur(null));
    test.ok(!recurs.isRecur(false));
    test.ok(!recurs.isRecur(true));
    test.ok(!recurs.isRecur(42));
    test.ok(!recurs.isRecur("foo"));
    test.ok(!recurs.isRecur(lists.create([1, 2, 3])));
}

