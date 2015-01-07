
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

exports['Get name with qualified namespace'] = function (test) {
    var lexer = lexers.lexer('cljs.core/foo');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'cljs.core/foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name with spaces'] = function (test) {
    var lexer = lexers.lexer('  foo   ');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name skipping commas'] = function (test) {
    var lexer = lexers.lexer('  ,,foo,,, ');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get names'] = function (test) {
    var lexer = lexers.lexer('foo bar');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'bar');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get string'] = function (test) {
    var lexer = lexers.lexer('"foo"');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.String);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get integer'] = function (test) {
    var lexer = lexers.lexer('42');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Integer);
    test.equal(token.value, '42');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get parenthesis as delimiter'] = function (test) {
    var lexer = lexers.lexer('()');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '(');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, ')');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get square brackets as delimiters'] = function (test) {
    var lexer = lexers.lexer('[]');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '[');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, ']');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get handlebars as delimiters'] = function (test) {
    var lexer = lexers.lexer('{}');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '{');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '}');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get delimiter, name, delimiter'] = function (test) {
    var lexer = lexers.lexer('[x]');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '[');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'x');
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, ']');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get quote character and name'] = function (test) {
    var lexer = lexers.lexer("'x");
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "'");
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get ampersand character and name'] = function (test) {
    var lexer = lexers.lexer("&x");
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "&");
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get backquote character and name'] = function (test) {
    var lexer = lexers.lexer("`x");
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "`");
    
    var token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};
