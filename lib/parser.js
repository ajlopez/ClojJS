
var lexers = require('./lexer');
var TokenType = lexers.TokenType;
var symbols = require('./symbol');
var keywords = require('./keyword');
var lists = require('./list');
var vectors = require('./vector');
var maps = require('./map');

var symquote = symbols.symbol("quote");
var symbackquote = symbols.symbol("backquote");
var symunquote = symbols.symbol("unquote");

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
                
            if (token.value == "'")
                return lists.create([symquote, this.parse()]);
                
            if (token.value == "`")
                return lists.create([symbackquote, this.parse()]);

            if (token.value == "~")
                return lists.create([symunquote, this.parse()]);
                
            if (token.value[0] == ':')
                return keywords.keyword(token.value.substring(1));
                
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
        
        if (token.type == TokenType.Delimiter && token.value == '[') {
            var items = [];
            
            for (token = lexer.nextToken(); token && (token.type != TokenType.Delimiter || token.value != ']'); token = lexer.nextToken()) {
                lexer.pushToken(token);
                items.push(this.parse());
            }
            
            return vectors.create(items);
        }
        
        if (token.type == TokenType.Delimiter && token.value == '{') {
            var items = [];
            
            for (token = lexer.nextToken(); token && (token.type != TokenType.Delimiter || token.value != '}'); token = lexer.nextToken()) {
                lexer.pushToken(token);
                items.push(this.parse());
            }
            
            return maps.create(items);
        }
    }
}

function createParser(text) {
    return new Parser(text);
}

module.exports = {
    parser: createParser
};

