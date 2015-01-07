
function Vector(items) {
    this.get = function (n) { return items[n]; };
    
    this.length = function () { return items.length; }
    
    this.next = function () {
        if (items.length)
            return new Vector(items.slice(1));
            
        return null;
    }
    
    this.asString = function () {
        var result = '[';
        
        for (var k = 0; k < items.length; k++) {
            if (k)
                result += ' ';
                
            result += asString(items[k]);
        }
            
        return result + ']';
    };

    this.asCode = function (compilefn, context) {
        var result = 'vectors.create([';
                
        for (var k = 0; k < items.length; k++) {
            if (k)
                result += ', ';
                
            result += asCode(items[k], compilefn, context);
        }
            
        return result + '])';
    }
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
    create: function (items) { return new Vector(items); },
    isVector: function (value) { return value instanceof Vector; }
};

