
var keywords = require('./keyword');

function Map(keyvalues, map) {
    this.get = function (key) {
        if (keywords.isKeyword(key)) {
            for (var k = 0; k < keyvalues.length; k += 2)
                if (keywords.isKeyword(keyvalues[k]) && keyvalues[k].name() == key.name())
                    return keyvalues[k + 1];
        }
        else {
            for (var k = 0; k < keyvalues.length; k += 2)
                if (keyvalues[k] == key)
                    return keyvalues[k + 1];
        }
                
        if (map)
            return map.get(key);
            
        return null;
    }
    
    this.has = function (key) {
        if (keywords.isKeyword(key)) {
            for (var k = 0; k < keyvalues.length; k += 2)
                if (keywords.isKeyword(keyvalues[k]) && keyvalues[k].name() == key.name())
                    return true;
        }
        else {
            for (var k = 0; k < keyvalues.length; k += 2)
                if (keyvalues[k] == key)
                    return true;
        }
                
        if (map)
            return map.has(key);
            
        return false;
    }
    
    this.set = function (key, value) {
        return new Map([key, value], this);
    }
    
    this.asString = function () {
        var self = this;
        var result = '{';
        var keys = this.getKeys();
        var nkey = 0;
        
        keys.forEach(function (key) {
            var value = self.get(key);
            if (nkey)
                result += ' ';
            result += asString(key) + ' ' + asString(value);
            nkey++;
        });
            
        return result + '}';
    }
    
    this.asObject = function () {
        var self = this;
        var object = { };
        var keys = this.getKeys();
        
        keys.forEach(function (key) {
            var value = self.get(key);
            
            if (value.asObject)
                value = value.asObject();
            
            if (keywords.isKeyword(key))
                object[key.name()] = value;
            else
                object[key] = value;
        });
        
        return object;
    }
    
    this.asCode = function (compilefn, context) {
        var self = this;
        var result = 'maps.create([';
        var keys = this.getKeys();

        keys.forEach(function (key) {
            var value = self.get(key);
            
            if (result.length && result[result.length - 1] != '[')
                result += ', ';

            result += asCode(key, compilefn, context);
            
            result += ', ';
            
            result += asCode(value, compilefn, context);
        });
            
        result += '])';
        
        return result;
    }
    
    this.getKeys = function () {
        var keys = [];
        var kwords = [];
        var l = keyvalues.length;
        
        for (var k = 0; k < l; k += 2) {
            var key = keyvalues[k];
            keys.push(key);
            
            if (keywords.isKeyword(key))
                kwords.push(key.name());
        }
        
        if (map) {
            var mapkeys = map.getKeys();
            
            mapkeys.forEach(function (mapkey) {
                if (keys.indexOf(mapkey) >= 0)
                    return;
                    
                if (keywords.isKeyword(mapkey) && kwords.indexOf(mapkey.name()) >= 0)
                    return;
                    
                keys.push(mapkey);
                
                if (keywords.isKeyword(mapkey))
                    kwords.push(mapkey.name());
            });
        }
        
        return keys;
    }
    
    this.equals = function (value) {
        if (!(value instanceof Map))
            return false;
            
        var keys = this.getKeys();
        var keys2 = value.getKeys();
        var l = keys.length;
        
        if (keys.length != keys2.length)
            return false;
            
        for (var k = 0; k < l; k++) {
            var key = keys[k];
            
            if (keywords.isKeyword(key)) {
                var haskey = false;
                
                for (var j = 0; j < l; j++) {
                    var key2 = keys2[j];
                    
                    if (key.equals(key2)) {
                        haskey = true;
                        
                        // TODO review equality
                        if (this.get(key) != value.get(key2))
                            return false;
                            
                        break;
                    }
                }
                
                if (!haskey)
                    return false;
            }
            else if (keys2.indexOf(key) < 0)
                return false;
            else if (this.get(key) != value.get(key))
                return false;
        }
        
        return true;
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

function createMap(keyvalues) {
    return new Map(keyvalues);
}

module.exports = {
    create: createMap,
    isMap: function (map) { return map instanceof Map; }
}