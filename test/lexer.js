
var lexers = require('../lib/lexer');
var TokenType = lexers.TokenType;

exports['Create lexer'] = function (test) {
    var lexer = lexers.lexer('foo');
    
    test.ok(lexer);
    test.equal(typeof lexer, 'object');
};

exports['Get name'] = function (test) {
    var lexer = lexers.lexer('foo');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};