
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

module.exports = {
    isValid: isValid
}