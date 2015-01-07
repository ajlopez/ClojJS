
var symbols = require('./symbol');

function List(first, next) {
    this.first = function () { return first; };
    
    this.next = function () { return next; };
    
    this.asString = function () {
        var result = '(' + asString(first);
        
        for (var value = next; value != null; value = value.next())
            result += ' ' + asString(value.first());
            
        return result + ')';
    };
    
    this.asCode = function (compilefn, context) {
        if (compilefn && symbols.isSymbol(first) && first.name() == 'unquote')
            return compilefn(next.first(), context);

        if (compilefn && symbols.isSymbol(first) && first.name() == 'unquote-splicing') {
            var code = compilefn(next.first(), context);
            
            return "].concat(asArray(" + code + ")).concat([";
        }
        
        var nclose = 0;
            
        var result = 'lists.create([' + asCode(first, compilefn, context);
        nclose++;
                
        for (var value = next; value != null; value = value.next()) {
            if (result.length && result[result.length - 1] != '[')
                result += ', ';
                
            var code = asCode(value.first(), compilefn, context);
            
            if (code && code.length && code[code.length - 1] == '[')
                nclose++;
                
            result += code;
        }

        while (nclose--)
            result += '])';
        
        return result;
    }
    
    this.asArray = function () {
        var result = [];
        
        for (var list = this; list; list = list.next())
            result.push(list.first());
        
        return result;
    };
}

function createList(first, next) {
    return new List(first, next);
}

function createListFromItems(items) {
    var result = null;
    
    for (var k = items.length; k > 0;) {
        k--;
        
        result = createList(items[k], result);
    }
    
    return result;
}

function asString(value) {
    if (value == null)
        return 'nil';
        
    if (value.asString)
        return value.asString();
        
    return JSON.stringify(value);
}

function asCode(value, compilefn, context) {
    if (value == null)
        return 'null';
        
    if (value.asCode)
        return value.asCode(compilefn, context);
        
    return JSON.stringify(value);
}

module.exports = {
    list: createList,
    create: createListFromItems,
    isList: function (value) { return value instanceof List; }
};

