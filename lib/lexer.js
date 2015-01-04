
var TokenType = { Name: 1 };

function Token(type, value) {
    this.type = type;
    this.value = value;
}

function Lexer(text) {
    this.nextToken = function () {
        if (text == null)
            return null;
            
        var token = new Token(TokenType.Name, text);
        text = null;
        
        return token;
    }
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
};