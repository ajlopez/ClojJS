
var lists = require('./list');
var utils = require('./utils');

var emptyVector = new Vector([]);

function Vector(items) {
    this.get = function (n) { return items[n]; };
    
    this.nth = function (n) {
        if (!items || n < 0 || n >= items.length)
            throw new Error("Index out of bounds");

        return this.get(n);
    }
    
    this.assoc = function (keyvalues) {
        var newitems = items.slice();
        var l = keyvalues.length;
        
        for (var k = 0; k < l; k += 2)
            newitems[keyvalues[k]] = keyvalues[k + 1];
            
        return new Vector(newitems);
    }
    
    this.call = function (self, n) { return this.nth(n); }
    
    this.length = function () { return items.length; }
    
    this.next = function () {
        if (items.length)
            return lists.create(items.slice(1));
            
        return null;
    }
    
    this.rest = function () {
        if (items.length)
            return lists.create(items.slice(1));
            
        return emptyVector;
    }
    
    this.first = function () {
        if (items.length)
            return items[0];
        else
            return null;
    }
    
    this.has = function (key) {
        if (key >= 0 && key < items.length)
            return true;
            
        return false;
    }
    
    this.asString = function () {
        var result = '[';
        
        for (var k = 0; k < items.length; k++) {
            if (k)
                result += ' ';
                
            result += utils.asString(items[k]);
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
    
    this.asArray = function () { return items; }
    
    this.equals = function (value) {
        if (value == null)
            return false;
        if (!(value instanceof Vector))
            return false;
            
        if (this.length() != value.length())
            return false;
            
        var array = value.asArray();
        
        for (var n in items)
            if (!utils.equals(items[n], array[n]))
                return false;
                
        return true;
    }
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

