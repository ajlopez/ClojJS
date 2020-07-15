
const lexers = require('../lib/lexer');
const TokenType = lexers.TokenType;

exports['Create lexer'] = function (test) {
    const lexer = lexers.lexer('foo');
    
    test.ok(lexer);
    test.equal(typeof lexer, 'object');
};

exports['Get name'] = function (test) {
    const lexer = lexers.lexer('foo');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get dollar name'] = function (test) {
    const lexer = lexers.lexer('$foo');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, '$foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name skipping line comment'] = function (test) {
    const lexer = lexers.lexer('; this is a comment\nfoo');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name skipping line comment ending in carriage return'] = function (test) {
    const lexer = lexers.lexer('; this is a comment\rfoo');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name with qualified namespace'] = function (test) {
    const lexer = lexers.lexer('cljs.core/foo');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'cljs.core/foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name with spaces'] = function (test) {
    const lexer = lexers.lexer('  foo   ');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get name skipping commas'] = function (test) {
    const lexer = lexers.lexer('  ,,foo,,, ');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get names'] = function (test) {
    const lexer = lexers.lexer('foo bar');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, 'foo');
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'bar');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get string'] = function (test) {
    const lexer = lexers.lexer('"foo"');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.String);
    test.equal(token.value, 'foo');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get integer'] = function (test) {
    const lexer = lexers.lexer('42');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Integer);
    test.equal(token.value, '42');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get negative integer'] = function (test) {
    const lexer = lexers.lexer('-123');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Integer);
    test.equal(token.value, '-123');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get parenthesis as delimiter'] = function (test) {
    const lexer = lexers.lexer('()');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '(');
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Delimiter);
    test.equal(token2.value, ')');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get square brackets as delimiters'] = function (test) {
    const lexer = lexers.lexer('[]');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '[');
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Delimiter);
    test.equal(token2.value, ']');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get handlebars as delimiters'] = function (test) {
    const lexer = lexers.lexer('{}');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '{');
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Delimiter);
    test.equal(token2.value, '}');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get numeral and handlebars as delimiters'] = function (test) {
    const lexer = lexers.lexer('#{}');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '#{');
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Delimiter);
    test.equal(token2.value, '}');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get delimiter, name, delimiter'] = function (test) {
    const lexer = lexers.lexer('[x]');
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Delimiter);
    test.equal(token.value, '[');
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'x');
    
    const token3 = lexer.nextToken();
    
    test.ok(token3);
    test.equal(token3.type, TokenType.Delimiter);
    test.equal(token3.value, ']');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get quote character and name'] = function (test) {
    const lexer = lexers.lexer("'x");
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "'");
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get ampersand character and name'] = function (test) {
    const lexer = lexers.lexer("&x");
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "&");
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get backquote character and name'] = function (test) {
    const lexer = lexers.lexer("`x");
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "`");
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get unquote character and name'] = function (test) {
    const lexer = lexers.lexer("~x");
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "~");
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};

exports['Get unquote splicing and name'] = function (test) {
    const lexer = lexers.lexer("~@x");
    
    const token = lexer.nextToken();
    
    test.ok(token);
    test.equal(token.type, TokenType.Name);
    test.equal(token.value, "~@");
    
    const token2 = lexer.nextToken();
    
    test.ok(token2);
    test.equal(token2.type, TokenType.Name);
    test.equal(token2.value, 'x');
    
    test.strictEqual(lexer.nextToken(), null);
};
