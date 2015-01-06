
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
}

function createMap(keyvalues) {
    return new Map(keyvalues);
}

module.exports = {
    create: createMap,
    isMap: function (map) { return map instanceof Map; }
}