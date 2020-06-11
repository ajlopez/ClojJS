
const keywords = require('./keyword');
const utils = require('./utils');

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
        for (let k = 0; k < keyvalues.length; k += 2)
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
        const keys = this.getKeys();
        const newkvs = [];
        const self = this;
        
        keys.forEach(function (k) {
            if (utils.equals(k, key))
                return;
                
            newkvs.push(k);
            newkvs.push(self.get(k));
        });
        
        return new Map(newkvs);
    }

    this.dissoc = function (oldkeys) {
        const keys = this.getKeys();
        const newkvs = [];
        const self = this;
        const l = oldkeys.length;
        
        keys.forEach(function (ky) {
            for (let k = 0; k < l; k++)
                if (utils.equals(ky, oldkeys[k]))
                    return;
                
            newkvs.push(ky);
            newkvs.push(self.get(ky));
        });
        
        if (keys.length * 2 === newkvs.length)
            return this;
        
        return new Map(newkvs);
    }
    
    this.asString = function () {
        const self = this;
        let result = '{';
        const keys = this.getKeys();
        let nkey = 0;
        
        keys.forEach(function (key) {
            const value = self.get(key);
            
            if (nkey)
                result += ' ';
            
            result += utils.asString(key) + ' ' + utils.asString(value);
            nkey++;
        });
            
        return result + '}';
    }
    
    this.asObject = function () {
        const self = this;
        const object = { };
        const keys = this.getKeys();
        
        keys.forEach(function (key) {
            let value = self.get(key);
            
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
        const self = this;
        let result = 'maps.create([';
        const keys = this.getKeys();

        keys.forEach(function (key) {
            const value = self.get(key);
            
            if (result.length && result[result.length - 1] != '[')
                result += ', ';

            result += utils.asCode(key, compilefn, context);
            
            result += ', ';
            
            result += utils.asCode(value, compilefn, context);
        });
            
        result += '])';
        
        return result;
    }
    
    this.getValues = function () {
        const result = [];
        const keys = this.getKeys();
        const self = this;
        
        keys.forEach(function (key) {
            result.push(self.get(key));
        });
        
        return result;
    }
    
    this.getKeys = function () {
        const keys = [];
        const kwords = [];
        const l = keyvalues.length;
        
        for (let k = 0; k < l; k += 2) {
            const key = keyvalues[k];
            keys.push(key);
            
            if (keywords.isKeyword(key))
                kwords.push(key.name());
        }
        
        if (map) {
            const mapkeys = map.getKeys();
            
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
            
        const keys = this.getKeys();
        const keys2 = value.getKeys();
        const l = keys.length;
        
        if (keys.length != keys2.length)
            return false;
            
        for (let k = 0; k < l; k++) {
            const key1 = keys[k];
            let j;
            
            for (j = 0; j < l; j++) {
                const key2 = keys2[j];
                
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

