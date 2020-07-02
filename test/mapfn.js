
const mapfn = require('../lib/mapfn');
const lists = require('../lib/list');
const vectors = require('../lib/vector');

exports['Evaluate map on list'] = function (test) {
    const result = mapfn.apply(function (x) { return x+1; }, lists.create([1, 2, 3]));
    
    test.ok(result);
    test.equal(result.asString(), '(2 3 4)');
}

exports['Evaluate map on two lists'] = function (test) {
    const result = mapfn.apply(function (x, y) { return x + y; }, lists.create([1, 2, 3]), lists.create([4, 5, 6]));
    
    test.ok(result);
    test.equal(result.asString(), '(5 7 9)');
}

exports['Evaluate map on two lists of different sizes'] = function (test) {
    const result = mapfn.apply(function (x, y) { return x + y; }, lists.create([1, 2, 3]), lists.create([4, 5, 6, 7, 8, 9]));
    
    test.ok(result);
    test.equal(result.asString(), '(5 7 9)');
}

exports['Evaluate map on vector'] = function (test) {
    const result = mapfn.apply(function (x) { return x+1; }, vectors.create([1, 2, 3]));
    
    test.ok(result);
    test.equal(result.asString(), '(2 3 4)');
}

