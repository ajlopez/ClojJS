
var mapfn = require('../lib/mapfn');
var lists = require('../lib/list');

exports['Evaluate map on list'] = function (test) {
    var result = mapfn.apply(function (x) { return x+1; }, lists.create([1, 2, 3]));
    
    test.ok(result);
    test.equal(result.asString(), '(2 3 4)');
}