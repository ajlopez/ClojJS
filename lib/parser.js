
const lexers = require('./lexer');
const TokenType = lexers.TokenType;
const symbols = require('./symbol');
const keywords = require('./keyword');
const lists = require('./list');
const vectors = require('./vector');
const maps = require('./map');
const sets = require('./set');

const symquote = symbols.symbol("quote");
const symbackquote = symbols.symbol("backquote");
const symunquote = symbols.symbol("unquote");
const symunquotesplicing = symbols.symbol("unquote-splicing");

function Parser(text) {
    const lexer = lexers.lexer(text);
	const self = this;
    
    this.hasToken = function () {
        const token = lexer.nextToken();
        
        if (token)
            lexer.pushToken(token);
            
        return token != null;
    }
    
    this.parse = function () {
        const token = lexer.nextToken();
        
        if (token == null)
            return null;
            
        if (token.type === TokenType.Integer)
            return parseInt(token.value);
            
        if (token.type === TokenType.String)
            return token.value;
            
        if (token.type === TokenType.Name) {
            if (token.value === 'nil')
                return null;
            if (token.value === 'false')
                return false;
            if (token.value === 'true')
                return true;
                
            if (token.value === "'")
                return lists.create([symquote, this.parse()]);
                
            if (token.value === "`")
                return lists.create([symbackquote, this.parse()]);

            if (token.value === "~")
                return lists.create([symunquote, this.parse()]);

            if (token.value === "~@")
                return lists.create([symunquotesplicing, this.parse()]);
                
            if (token.value[0] === ':')
                return keywords.keyword(token.value.substring(1));
                
            return symbols.symbol(token.value);
        }
        
        if (token.type === TokenType.Delimiter && token.value === '(')
			return parseList();
        
        if (token.type === TokenType.Delimiter && token.value === '[') {
            const items = [];
            
            for (let token = lexer.nextToken(); token && (token.type !== TokenType.Delimiter || token.value !== ']'); token = lexer.nextToken()) {
                lexer.pushToken(token);
                items.push(this.parse());
            }
            
            if (!token)
                throw new Error("Unclosed vector");
            
            return vectors.create(items);
        }
        
        if (token.type === TokenType.Delimiter && token.value === '{') {
            const items = [];
            
            for (let token = lexer.nextToken(); token && (token.type !== TokenType.Delimiter || token.value !== '}'); token = lexer.nextToken()) {
                lexer.pushToken(token);
                items.push(this.parse());
            }
            
            return maps.create(items);
        }
        
        if (token.type === TokenType.Delimiter && token.value === '#{') {
            const items = [];
            
            for (let token = lexer.nextToken(); token && (token.type !== TokenType.Delimiter || token.value !== '}'); token = lexer.nextToken()) {
                lexer.pushToken(token);
                items.push(this.parse());
            }
            
            return sets.create(items);
        }
    }
	
	function parseList() {
		const items = [];
        let token;
		
		for (token = lexer.nextToken(); token && (token.type !== TokenType.Delimiter || token.value !== ')'); token = lexer.nextToken()) {
			lexer.pushToken(token);
			items.push(self.parse());
		}
		
		if (!token)
			throw new Error("Unclosed list");
		
		return lists.create(items);		
	}
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    parser: createParser
};

