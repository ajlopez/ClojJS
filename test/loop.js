
var loops = require('../lib/loop');
var recurs = require('../lib/recur');

exports['Evaluate loop'] = function (test) {
    var fn = function (x) {
        return function (y) {
            if (y > 0)
                return recurs.create([x + y, y - 1]);
            else
                return x;
        }
    };
    
    var result = loops.evaluate(fn, [0, 3]);
    
    test.ok(result);
    test.equal(result, 1 + 2 + 3);
}