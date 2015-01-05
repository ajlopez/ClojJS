
function Keyword(name) {
    this.name = function () { return name; }
    
    this.asString = function () { return ':' + name; }
}

function createKeyword(name) {
    return new Keyword(name);
}

module.exports = {
    keyword: createKeyword,
    isKeyword: function (value) { return value instanceof Keyword; }
};