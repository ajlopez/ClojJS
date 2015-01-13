
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
}

function create(fn) {
    return new LazySeq(fn);
}

module.exports = {
    create: create
}

