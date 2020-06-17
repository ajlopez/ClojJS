
const lists = require('./list');

function LazySeq(fn, colls) {
    this.first = function () {
        const args = [];
        
        colls.forEach(function (coll) {
            args.push(coll.first());
        });
        
        return fn.apply(null, args);
    }
    
    this.next = function () {
        const newcolls = [];
        
        for (let k = 0; k < colls.length; k++) {
            const newcoll = colls[k].next();
            
            if (newcoll == null)
                return null;
                
            newcolls.push(newcoll);
        }
        
        return new LazySeq(fn, newcolls);
    }
    
    this.rest = function () {
        const rest = this.next();
        
        if (rest == null)
            return lists.emptyList;
            
        return rest;
    }

    this.asString = function () {
        let result = '(' + asString(this.first());
        
        for (let value = this.next(); value != null; value = value.next())
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

function apply(fn) {
    const colls = [];
    
    for (let k = 1; k < arguments.length; k++)
        colls.push(arguments[k]);
        
    return new LazySeq(fn, colls);
}

module.exports = {
    apply: apply
}

