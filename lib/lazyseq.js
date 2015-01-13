
var lists = require('./list');

function LazySeq(fn) {
    var evaluated = false;
    var seq;
    
    this.first = function () {
        if (!evaluated)
            evaluate();
            
        if (seq == null)
            return lists.emptyList.first();
            
        return seq.first();
    }
    
    this.next = function () {
        if (!evaluated)
            evaluate();
            
        if (seq == null)
            return null;
            
        var result = seq.next();
        
        if (result && result.isEmpty && result.isEmpty())
            return null;
            
        return result;
    }
    
    this.rest = function () {
        if (!evaluated)
            evaluate();
                        
        if (seq == null)
            return lists.emptyList.rest();
            
        return seq.rest();
    }
    
    this.isEmpty = function () {
        if (!evaluated)
            evaluate();
            
        return seq == null;
    }
    
    function evaluate() {
        seq = fn();
        evaluated = true;
    }
    
    this.asString = function () {
        if (!evaluated)
            evaluate();
        
        if (seq == null)
            return lists.emptyList.asString();
            
        var result = '(' + asString(this.first());
        
        for (var value = this.next(); value != null; value = value.next())
            if (value.isEmpty && value.isEmpty())
                break;
            else
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

