
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