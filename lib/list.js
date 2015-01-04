
function List(first, next) {
    this.first = function () { return first; };
    
    this.next = function () { return next; };
    
    this.asString = function () {
        var result = '(' + asString(first);
        
        for (var value = next; value != null; value = value.next())
            result += ' ' + asString(value.first());
            
        return result + ')';
    };
}

function createList(first, next) {
    return new List(first, next);
}

function asString(value) {
    if (value == null)
        return 'nil';
        
    if (value.asString)
        return value.asString();
        
    return JSON.stringify(value);
}

module.exports = {
    list: createList,
    isList: function (value) { return value instanceof List; }
};

