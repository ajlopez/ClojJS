
var keywords = require('./keyword');
var utils = require('./utils');

function Set(keys, set) {
    this.has = function (key) {
        for (var k = 0; k < keys.length; k++)
            if (utils.equals(key, keys[k]))
                return true;
                
        if (set)
            return set.has(key);
            
        return false;
    }

    this.get = function (key) { return this.has(key) ? key : null; }
    this.call = function (self, key) { return this.get(key); }
    
    this.add = function (key) {
        if (this.has(key))
            return this;
            
        return new Set([key], this);
    }
    
    this.remove = function (key) {
        if (!this.has(key))
            return this;
            
        var newkeys = [];
        
        var keys = this.getKeys();
        
        for (var k = 0; k < keys.length; k++)
            if (!utils.equals(key, keys[k]))
                newkeys.push(keys[k]);
                    
        return new Set(newkeys);
    }
    
    this.asString = function () {
        var self = this;
        var result = '#{';
        var nkey = 0;
        var keys = this.getKeys();
        
        keys.forEach(function (key) {
            if (nkey)
                result += ' ';
            result += utils.asString(key);
            nkey++;
        });
            
        return result + '}';
    }
    
    this.asObject = function () {
        var self = this;
        var object = { };
        var keys = this.getKeys();
        
        keys.forEach(function (key) {
            if (keywords.isKeyword(key))
                object[key.name()] = true;
            else
                object[key] = true;
        });
        
        return object;
    }
    
    this.asArray = function () {
        var self = this;
        var array = [];
        var keys = this.getKeys();
        
        keys.forEach(function (key) {
            if (key && key.asArray)
                array.push(key.asArray());
            else
                array.push(key);
        });
        
        return array;
    }
    
    this.asCode = function (compilefn, context) {
        var self = this;
        var result = 'sets.create([';
        var keys = this.getKeys();

        keys.forEach(function (key) {
            if (result.length && result[result.length - 1] != '[')
                result += ', ';

            result += asCode(key, compilefn, context);
        });
            
        result += '])';
        
        return result;
    }
    
    this.getKeys = function () {
        var allkeys = keys.slice();
        
        if (set) {
            var setkeys = set.getKeys();
            
            setkeys.forEach(function (setkey) {
                var l = allkeys.length;
                
                for (var k = 0; k < l; k++)
                    if (utils.equals(setkey, allkeys[k]))
                        return;
                                            
                allkeys.push(setkey);
            });
        }
        
        return allkeys;
    }

    this.equals = function (value) {
        if (!(value instanceof Set))
            return false;
            
        var keys = this.getKeys();
        var keys2 = value.getKeys();
        var l = keys.length;
        
        if (keys.length != keys2.length)
            return false;
            
        for (var k = 0; k < l; k++) {
            var key1 = keys[k];
            
            for (var j = 0; j < l; j++) {
                var key2 = keys2[j];
                
                if (!utils.equals(key1, key2))
                    continue;
                    
                break;
            }
            
            if (j >= l)
                return false;
        }
        
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

function createSet(keys) {
    return new Set(keys);
}

module.exports = {
    create: createSet,
    isSet: function (set) { return set instanceof Set; }
}

