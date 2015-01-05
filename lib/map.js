
function Map(keyvalues) {
    this.get = function (key) {
        for (var k = 0; k < keyvalues.length; k += 2)
            if (keyvalues[k] == key)
                return keyvalues[k + 1];
                
        return null;
    }
}

function createMap(keyvalues) {
    return new Map(keyvalues);
}

module.exports = {
    create: createMap
}