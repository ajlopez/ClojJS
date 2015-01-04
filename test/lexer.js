
var lexers = require('../lib/lexer');

exports['Create lexer'] = function (test) {
    var lexer = lexers.lexer('foo');
    
    test.ok(lexer);
    test.equal(typeof lexer, 'object');
};

