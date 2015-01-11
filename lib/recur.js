
function Recur(items) {
    this.length = function () { return items ? items.length : 0; };
    
    this.get = function (n) { return items[n] }
}

function createRecur(items) {
    return new Recur(items);
}

module.exports = {
    create: createRecur,
    isRecur: function (value) { return value instanceof Recur; }
};