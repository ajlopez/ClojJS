
var lists = require('./list');

function LazySeq(fn) {
    var evaluated = false;
    var seq;
    
    this.first = function () {
        if (!evaluated)
            evaluate();
            
        return seq.first();
    }
    
    this.next = function () {
        if (!evaluated)
            evaluate();
            
        return seq.next();
    }
    
    this.rest = function () {
        if (!evaluated)
            evaluate();
            
        return seq.rest();
    }
    
    function evaluate() {
        seq = fn();
        evaluated = true;
    }
    
    this.asString = function () {
        var result = '(' + asString(this.first());
        
        for (var value = this.next(); value != null; value = value.next())
            result += ' ' + asString(value.first());
            
        return result + ')';
    };
}

function asString(value) {
    if (value == null)
        return 'nil';
        
    if (value.asString)
        return value.asString();
        
    return JSON.stringify(value);
}

function create(fn) {
    if (fn == null)
        return lists.emptyList;

    return new LazySeq(fn);
}

module.exports = {
    create: create,
    isLazySeq: function (value) { return value instanceof LazySeq; }
}

