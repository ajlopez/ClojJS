
const TokenType = { Name: 1, String: 2, Integer: 3, Delimiter: 4 };

const delimiters = [ '(', ')', '[', ']', '{', '}', '#{' ];

function Token(type, value) {
    this.type = type;
    this.value = value;
}

function Lexer(text) {
    const length = text.length;
    let position = 0;
    const tokens = [];
        
    this.nextToken = function () {
        if (tokens.length)
            return tokens.pop();

		skipWhiteSpaces();
            
        if (position >= length)
            return null;
        
        let value = text[position++];
        
        if (value === "~" && text[position] === '@') {
            position++;
            return new Token(TokenType.Name, "~@");
        }
        
        if (value === "'" || value === "&" || value === "`" || value === "~")
            return new Token(TokenType.Name, value);
        
        if (isDelimiter(value + text[position])) {
            value += text[position++];
            return new Token(TokenType.Delimiter, value);
        }
            
        if (isDelimiter(value))
            return new Token(TokenType.Delimiter, value);
            
        if (value === '"')
			return nextString();
        
        if (isDigit(value) || (value === '-' && isDigit(text[position])))
			return nextInteger(value);
        
        while (position < length && !isSpace(text[position]) && !isDelimiter(text[position]))
            value += text[position++];
            
        return new Token(TokenType.Name, value);
    }
    
    this.pushToken = function (token) {
        if (token != null)
            tokens.push(token);
    }
	
	function nextString() {
		let value = "";
		
		while (position < length && text[position] !== '"')
			value += text[position++];
			
		if (position < length)
			position++;
			
		return new Token(TokenType.String, value);
	}
	
	function nextInteger(value) {
		while (position < length && isDigit(text[position]))
			value += text[position++];
			
		return new Token(TokenType.Integer, value);
	}
	
	function skipWhiteSpaces() {
        while (true) {
            while (position < length && isSpace(text[position]))
                position++;
                
            if (position < length && text[position] === ';') {
                while (position < length && text[position] !== '\n' && text[position] !== '\r')
                    position++;
                continue;
            }
            
            break;
        }
	}
}

function isSpace(ch) {
    return ch <= ' ' || ch === ',';
}

function isDigit(ch) {
    return ch >= '0' && ch <= '9';
}

function isDelimiter(ch) {
    return delimiters.indexOf(ch) >= 0;
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    lexer: createLexer,
    TokenType: TokenType
};

