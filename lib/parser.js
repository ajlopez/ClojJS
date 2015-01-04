
var lexers = require('./lexer');
var TokenType = lexers.TokenType;

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
        }
    }
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    parser: createParser
};