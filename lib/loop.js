
var recurs = require('./recur');

function evaluate(fn, values) {
    while (true) {
        var result = fn(values[0]);
        
        for (var k = 1; k < values.length; k++)
            result = result(values[k]);

        if (recurs.isRecur(result))
            values = result.items();
        else
            return result;
    }
}

module.exports = {
    evaluate: evaluate
}