
function Symbol(name) {
    this.name = function () { return name; }
    
    this.asString = function () { return name; }
    
    this.asCode = function () { return 'symbols.symbol(' + JSON.stringify(name) + ')'; }
}

function createSymbol(name) {
    return new Symbol(name);
}

module.exports = {
    symbol: createSymbol,
    isSymbol: function (value) { return value instanceof Symbol; }
};