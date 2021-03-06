
const lists = require('./list');
const vectors = require('./vector');
const sets = require('./set');
const maps = require('./map');
const lazyseqs = require('./lazyseq');
const utils = require('./utils');

if (typeof cljs == 'undefined')
    cljs = {};
    
if (typeof cljs.core == 'undefined')
    cljs.core = {};
    
cljs.core.list = function () {
    return lists.create(arguments);
}

cljs.core.first = function (list) { return list == null ? null : list.first(); }

cljs.core.next = function (list) { return list.next(); }

cljs.core.rest = function (list) { return list.rest(); }

cljs.core.pop = function (list) { 
    if (list.pop)
        return list.pop();

    return list.rest(); 
}

cljs.core.nth = function (list, n, defvalue) {
    if (list == null || lists.isEmptyList(list))
        if (defvalue != null)
            return defvalue;
        else
            return null;
    
    if (vectors.isVector(list)) {
        if (n < list.length())
            return list.get(n);
            
        if (defvalue != null)
            return defvalue;
        else
            return null;
    }
    
    while (n > 0) {
        list = list.next();
        n--;
        
        if (!list)
            if (defvalue != null)
                return defvalue;
            else
                return null;
    }
        
    return list.first(); 
}

cljs.core.cons = function (first, next) { return lists.list(first, cljs.core.seq(next)); }

cljs.core.seq = function (value) {
    if (value == null)
        return null;
        
    if (lists.isEmptyList(value))
        return null;
        
    if (vectors.isVector(value)) {
        if (value.length() == 0)
            return null;
        else
            return lists.create(value.asArray());
    }
    
    if (sets.isSet(value)) {
        const keys = value.getKeys();
        
        if (keys.length == 0)
            return null;
            
        return lists.create(keys);
    }
        
    if (lists.isList(value))
        return value;
        
    if (lazyseqs.isLazySeq(value))
        return value;
        
    if (maps.isMap(value)) {
        const result = [];
        const keys = value.getKeys();
        
        if (keys.length == 0)
            return null;
            
        for (let n in keys) {
            const key = keys[n];
            const val = value.get(key);
            result.push(vectors.create([key, val]));
        }        
        
        return lists.create(result);
    }
        
    if (typeof value == 'string')
        if (value == '')
            return null;
        else
            return lists.create(value.split(''));
        
    if (Array.isArray(value))
        if (value.length == 0)
            return null;
        else
            return lists.create(value);

    throw new Error("Don't know how to create sequence from: " + value);
}

cljs.core.length = function (value) { return value.length(); }

cljs.core.equals = function (value1, value2) {
    return utils.equals(value1, value2);
}

cljs.core.str = function () {
    let result = '';
    const l = arguments.length;
    
    for (let k = 0; k < l; k++) {
        const arg = arguments[k];
        
        if (arg == null)
            result += 'nil';
        else if (arg.asString)
            result += arg.asString();
        else
            result += arg.toString();
    }
    
    return result;
}

cljs.core.throw = function (ex) { throw ex; }

cljs.core.less = function (a, b ) { return a < b; }
cljs.core.lessEqual = function (a, b ) { return a <= b; }
cljs.core.greater = function (a, b ) { return a > b; }
cljs.core.greaterEqual = function (a, b ) { return a >= b; }

cljs.core.empty = function (value) {
    if (lists.isList(value))
        return lists.emptyList;
        
    if (vectors.isVector(value))
        return vectors.create([]);
        
    if (maps.isMap(value))
        return maps.create([]);
        
    if (sets.isSet(value))
        return sets.create([]);
}

cljs.core.rand = function (n) {
    if (n == null)
        return Math.random();
        
    return Math.random() * n;
}

cljs.core.rand_HY_int = function (n) {
    return Math.floor(Math.random() * n);
}

function isEmpty(value) {
    if (value == null)
        return true;
        
    if (lists.isEmptyList(value))
        return true;
        
    if (value.isEmpty)
        return value.isEmpty();
        
    return false;
}

