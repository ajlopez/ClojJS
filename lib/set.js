
const keywords = require('./keyword');
const utils = require('./utils');

function Set(keys, set) {
    this.has = function (key) {
        for (let k = 0; k < keys.length; k++)
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
            
        const newkeys = [];
        
        const keys = this.getKeys();
        
        for (let k = 0; k < keys.length; k++)
            if (!utils.equals(key, keys[k]))
                newkeys.push(keys[k]);
                    
        return new Set(newkeys);
    }
    
    this.asString = function () {
        const self = this;
        let result = '#{';
        let nkey = 0;
        const keys = this.getKeys();
        
        keys.forEach(function (key) {
            if (nkey)
                result += ' ';
            result += utils.asString(key);
            nkey++;
        });
            
        return result + '}';
    }
    
    this.asObject = function () {
        const self = this;
        const object = { };
        const keys = this.getKeys();
        
        keys.forEach(function (key) {
            if (keywords.isKeyword(key))
                object[key.name()] = true;
            else
                object[key] = true;
        });
        
        return object;
    }
    
    this.asArray = function () {
        const self = this;
        const array = [];
        const keys = this.getKeys();
        
        keys.forEach(function (key) {
            if (key && key.asArray)
                array.push(key.asArray());
            else
                array.push(key);
        });
        
        return array;
    }
    
    this.asCode = function (compilefn, context) {
        const self = this;
        let result = 'sets.create([';
        const keys = this.getKeys();

        keys.forEach(function (key) {
            if (result.length && result[result.length - 1] !== '[')
                result += ', ';

            result += utils.asCode(key, compilefn, context);
        });
            
        result += '])';
        
        return result;
    }
    
    this.getKeys = function () {
        const allkeys = keys.slice();
        
        if (set) {
            const setkeys = set.getKeys();
            
            setkeys.forEach(function (setkey) {
                const l = allkeys.length;
                
                for (let k = 0; k < l; k++)
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
                    
                break;
            }
            
            if (j >= l)
                return false;
        }
        
        return true;
    }
}

function createSet(keys) {
    return new Set(keys);
}

module.exports = {
    create: createSet,
    isSet: function (set) { return set instanceof Set; }
}

