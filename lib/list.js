
const symbols = require('./symbol');
const utils = require('./utils');

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

const emptyList = new EmptyList();

function List(first, next) {
    this.first = function () { return first; };
    
    this.next = function () { return next; };
    
    this.rest = function () { return next == null ? emptyList : next; };
    
    this.length = function () { return 1 + (next ? next.length() : 0); };
    
    this.asString = function () {
        let result = '(' + utils.asString(first);
        
        for (let value = next; value != null; value = value.next())
            result += ' ' + utils.asString(value.first());
            
        return result + ')';
    };
    
    this.asCode = function (compilefn, context) {
        if (compilefn && symbols.isSymbol(first) && first.name() === 'unquote')
            return compilefn(next.first(), context);

        if (compilefn && symbols.isSymbol(first) && first.name() === 'unquote-splicing') {
            const code = compilefn(next.first(), context);
            
            return "].concat(asArray(" + code + ")).concat([";
        }
        
        let nclose = 0;
            
        let result = 'lists.create([' + utils.asCode(first, compilefn, context);
                
        for (let value = next; value != null; value = value.next()) {
            if (result.length && result[result.length - 1] !== '[')
                result += ', ';
                
            var code = utils.asCode(value.first(), compilefn, context);
            
            if (code && code.length && code[code.length - 1] === '[')
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
        const result = [];
        
        for (let list = this; list; list = list.next())
            result.push(list.first());
        
        return result;
    };
    
    this.containsSymbol = function (name) {
        for (let list = this; list; list = list.next()) {
            const item = list.first();
            
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
        
    let result = null;
    
    for (let k = items.length; k > 0;) {
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



