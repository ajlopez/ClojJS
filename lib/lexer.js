
var TokenType = { Name: 1 };

function Token(type, value) {
    this.type = type;
    this.value = value;
}

function Lexer(text) {
    var length = text.length;
    var position = 0;
    
    this.nextToken = function () {
        while (position < length && isSpace(text[position]))
            position++;
            
        if (position >= length)
            return null;
        
        var value = text[position++];
        
        while (position < length && !isSpace(text[position]))
            value += text[position++];
            
        var token = new Token(TokenType.Name, value);
        
        return token;
    }
}

function isSpace(ch) {
    return ch <= ' ';
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
};