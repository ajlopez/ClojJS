
function asString(value) {
    if (value == null)
        return 'nil';
        
    if (value.asString)
        return value.asString();
        
    return JSON.stringify(value);
}

function equals(value1, value2) {
    if (value1 == null)
        return value1 == value2;
        
    if (value1 === value2)
        return true;
        
    if (value1.equals)
        return value1.equals(value2);
        
    return false;
}

module.exports = {
    asString: asString,
    equals: equals
}