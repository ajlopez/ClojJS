
const loops = require('../lib/loop');
const recurs = require('../lib/recur');

exports['Evaluate loop'] = function (test) {
    const fn = function (x) {
        return function (y) {
            if (y > 0)
                return recurs.create([x + y, y - 1]);
            else
                return x;
        }
    };
    
    const result = loops.evaluate(fn, [0, 3]);
    
    test.ok(result);
    test.equal(result, 1 + 2 + 3);
}

