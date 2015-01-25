
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

function equals(value1, value2) {
    if (value1 == null)
        return value1 == value2;
        
    if (value1 === value2)
        return true;
        
    if (value1.equals)
        return value1.equals(value2);
        
    if (value1.first && value1.next)
        if (value2.first && value2.next)
            return equals(value1.first(), value2.first()) && equals(value1.next(), value2.next());
        
    return false;
}

module.exports = {
    asString: asString,
    asCode: asCode,
    equals: equals
}