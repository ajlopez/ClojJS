
var symbols = require('./symbol');
var utils = require('./utils');

function EmptyList() {
    this.first = function () { return null; }
    
    this.rest = function () { return this; }
    
    this.next = function () { return null; }
    
    this.length = function () { return 0; }
    
    this.asString = function () { return "()"; }
    
    this.asCode = function () { return "lists.emptyList"; }
    
    this.asArray = function () { return []; }
    
    this.containsSymbol = function () { return false; }
}

var emptyList = new EmptyList();

function List(first, next) {
    this.first = function () { return first; };
    
    this.next = function () { return next; };
    
    this.rest = function () { return next == null ? emptyList : next; };
    
    this.length = function () { return 1 + (next ? next.length() : 0); };
    
    this.asString = function () {
        var result = '(' + utils.asString(first);
        
        for (var value = next; value != null; value = value.next())
            result += ' ' + utils.asString(value.first());
            
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
            
        var result = 'lists.create([' + utils.asCode(first, compilefn, context);
                
        for (var value = next; value != null; value = value.next()) {
            if (result.length && result[result.length - 1] != '[')
                result += ', ';
                
            var code = utils.asCode(value.first(), compilefn, context);
            
            if (code && code.length && code[code.length - 1] == '[')
                nclose++;
                
            result += code;
        }

        if (nclose)
            while (nclose--)
                result += '])';
        else
            result += ']';
            
        result += ')';
        
        return result;
    }
    
    this.asArray = function () {
        var result = [];
        
        for (var list = this; list; list = list.next())
            result.push(list.first());
        
        return result;
    };
    
    this.containsSymbol = function (name) {
        for (var list = this; list; list = list.next()) {
            var item = list.first();
            
            if (!item)
                continue;
                
            if (symbols.isSymbol(item) && item.name() == name)
                return true;
                
            if (module.exports.isList(item) && item.containsSymbol(name))
                return true;
        }
        
        return false;
    }
}

function createList(first, next) {
    return new List(first, next);
}

function createListFromItems(items) {
    if (items == null || items.length == 0)
        return emptyList;
        
    var result = null;
    
    for (var k = items.length; k > 0;) {
        k--;
        
        result = createList(items[k], result);
    }
    
    return result;
}

module.exports = {
    list: createList,
    create: createListFromItems,
    isList: function (value) { return value instanceof List || value instanceof EmptyList; },
    isEmptyList: function (value) { return value instanceof EmptyList; },
    emptyList: emptyList
};


