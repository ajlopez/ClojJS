
var path = require('path');

function isValid(nsname) {
    if (nsname == null || nsname.length == 0)
        return false;
        
    if (!isLowerCaseLetter(nsname[0]))
        return false;
        
    if (!isLowerCaseLetter(nsname[nsname.length - 1]))
        return false;
        
    var names = nsname.split('.');
    
    if (names.length > 1)
        for (var k = 0; k < names.length; k++)
            if (!isValid(names[k]))
                return false;
        
    return true;
}

function isLowerCaseLetter(ch) {
    return ch >= 'a' && ch <= 'z';
}

function toFilename(src, nsname) {
    var names = nsname.split('.');
    var filename = src;
    
    for (var k = 0; k < names.length - 1; k++)
        filename = path.join(filename, names[k]);
        
    filename = path.join(filename, names[names.length - 1] + '.cljs');
    
    return filename;
}

function toSource(filename, nsname) {
    var names = nsname.split('.');
    var source = filename;
    
    for (var k = 0; k < names.length; k++)
        source = path.dirname(source);
        
    return source;
}

module.exports = {
    isValid: isValid,
    toFilename: toFilename,
    toSource: toSource
}

