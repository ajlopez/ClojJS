
var keywords = require('./keyword');
var utils = require('./utils');

function Map(keyvalues, map) {
    this.get = function (key) {
        for (var k = 0; k < keyvalues.length; k += 2)
            if (utils.equals(key, keyvalues[k]))
                return keyvalues[k + 1];
                
        if (map)
            return map.get(key);
            
        return null;
    }

    this.call = function (self, key) { return this.get(key); }
    
    this.has = function (key) {
        for (var k = 0; k < keyvalues.length; k += 2)
            if (utils.equals(key, keyvalues[k]))
                return true;
                
        if (map)
            return map.has(key);
            
        return false;
    }
    
    this.set = function (key, value) {
        return new Map([key, value], this);
    }
    
    this.assoc = function (keyvalues) {
        return new Map(keyvalues, this);
    }
    
    this.remove = function (key) {
        var keys = this.getKeys();
        var newkvs = [];
        var self = this;
        
        keys.forEach(function (k) {
            if (utils.equals(k, key))
                return;
                
            newkvs.push(k);
            newkvs.push(self.get(k));
        });
        
        return new Map(newkvs);
    }

    this.dissoc = function (oldkeys) {
        var keys = this.getKeys();
        var newkvs = [];
        var self = this;
        var l = oldkeys.length;
        
        keys.forEach(function (ky) {
            for (var k = 0; k < l; k++)
                if (utils.equals(ky, oldkeys[k]))
                    return;
                
            newkvs.push(ky);
            newkvs.push(self.get(ky));
        });
        
        if (keys.length * 2 == newkvs.length)
            return this;
        
        return new Map(newkvs);
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
            result += utils.asString(key) + ' ' + utils.asString(value);
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

            result += utils.asCode(key, compilefn, context);
            
            result += ', ';
            
            result += utils.asCode(value, compilefn, context);
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
            var key1 = keys[k];
            
            for (var j = 0; j < l; j++) {
                var key2 = keys2[j];
                
                if (!utils.equals(key1, key2))
                    continue;
                    
                if (!utils.equals(this.get(key1), value.get(key2)))
                    return false;
                    
                break;
            }
            
            if (j >= l)
                return false;
        }
        
        return true;
    }
}

function createMap(keyvalues) {
    return new Map(keyvalues);
}

module.exports = {
    create: createMap,
    isMap: function (map) { return map instanceof Map; }
}

