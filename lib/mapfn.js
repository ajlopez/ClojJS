
var lists = require('./list');

function LazySeq(fn, colls) {
    this.first = function () {
        var args = [];
        
        colls.forEach(function (coll) {
            args.push(coll.first());
        });
        
        return fn.apply(null, args);
    }
    
    this.next = function () {
        var newcolls = [];
        
        for (var k = 0; k < colls.length; k++) {
            var newcoll = colls[k].next();
            
            if (newcoll == null)
                return null;
                
            newcolls.push(newcoll);
        }
        
        return new LazySeq(fn, newcolls);
    }
    
    this.rest = function () {
        var rest = this.next();
        
        if (rest == null)
            return lists.emptyList;
            
        return rest;
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

function apply(fn, coll) {
    return new LazySeq(fn, [coll]);
}

module.exports = {
    apply: apply
}