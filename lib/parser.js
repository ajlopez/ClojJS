
var lexers = require('./lexer');
var TokenType = lexers.TokenType;
var symbols = require('./symbol');
var lists = require('./list');

function Parser(text) {
    var lexer = lexers.lexer(text);
    
    this.parse = function () {
        var token = lexer.nextToken();
        
        if (token == null)
            return null;
            
        if (token.type == TokenType.Integer)
            return parseInt(token.value);
            
        if (token.type == TokenType.String)
            return token.value;
            
        if (token.type == TokenType.Name) {
            if (token.value == 'nil')
                return null;
            if (token.value == 'false')
                return false;
            if (token.value == 'true')
                return true;
                
            return symbols.symbol(token.value);
        }
        
        if (token.type == TokenType.Delimiter && token.value == '(') {
            var items = [];
            
            for (token = lexer.nextToken(); token && (token.type != TokenType.Delimiter || token.value != ')'); token = lexer.nextToken()) {
                lexer.pushToken(token);
                items.push(this.parse());
            }
            
            return lists.create(items);
        }
    }
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    parser: createParser
};