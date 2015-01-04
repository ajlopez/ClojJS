
var TokenType = { Name: 1, String: 2, Delimiter: 3 };

var delimiters = [ '(', ')', '[', ']' ];

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
        
        if (delimiters.indexOf(value) >= 0)
            return new Token(TokenType.Delimiter, value);
            
        if (value == '"') {
            value = "";
            
            while (position < length && text[position] != '"')
                value += text[position++];
                
            if (position < length)
                position++;
                
            return new Token(TokenType.String, value);
        }
        
        while (position < length && !isSpace(text[position]))
            value += text[position++];
            
        var token = new Token(TokenType.Name, value);
        
        return token;
    }
}

function isSpace(ch) {
    return ch <= ' ' || ch == ',';
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
};