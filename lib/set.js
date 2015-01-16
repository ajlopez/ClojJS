
var keywords = require('./keyword');
var utils = require('./utils');

function Set(keys, set) {
    this.has = function (key) {
        if (keywords.isKeyword(key)) {
            for (var k = 0; k < keys.length; k++)
                if (keywords.isKeyword(keys[k]) && keys[k].name() == key.name())
                    return true;
        }
        else if (keys.indexOf(key) >= 0)
            return true;
                
        if (set)
            return set.has(key);
            
        return false;
    }
    
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
        
        if (keywords.isKeyword(key)) {
            for (var k = 0; k < keys.length; k++)
                if (!keywords.isKeyword(keys[k]) || keys[k].name() != key.name())
                    newkeys.push(keys[k]);
        }
        else {
            for (var k = 0; k < keys.length; k++)
                if (keys[k] != key)
                    newkeys.push(keys[k]);
        }
                    
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
        var allkeys = [];
        var kwords = [];
        var l = keys.length;
        
        for (var k = 0; k < l; k++) {
            var key = keys[k];
            allkeys.push(key);
            
            if (keywords.isKeyword(key))
                kwords.push(key.name());
        }
        
        if (set) {
            var setkeys = set.getKeys();
            
            setkeys.forEach(function (mapkey) {
                if (allkeys.indexOf(setkey) >= 0)
                    return;
                    
                if (keywords.isKeyword(setkey) && kwords.indexOf(setkey.name()) >= 0)
                    return;
                    
                allkeys.push(setkey);
                
                if (keywords.isKeyword(setkey))
                    kwords.push(setkey.name());
            });
        }
        
        return allkeys;
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