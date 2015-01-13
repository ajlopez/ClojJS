
var lists = require('./list');
var vectors = require('./vector');
var lazyseqs = require('./lazyseq');

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

cljs.core.cons = function (first, next) { return lists.list(first, next); }

cljs.core.seq = function (value) {
    if (value == null)
        return null;
    
    if (lists.isEmptyList(value))
        return null;
        
    if (lists.isList(value))
        return value;
        
    if (lazyseqs.isLazySeq(value))
        return value;
        
    if (vectors.isVector(value))
        return lists.create(value.asArray());
        
    if (typeof value == 'string')
        return lists.create(value.split(''));
        
    if (Array.isArray(value))
        return lists.create(value);

    throw new Error("Don't know how to create sequence from: " + value);
}

cljs.core.length = function (value) { return value.length(); }

cljs.core.equals = function (value1, value2) {
    if (value1 == value2)
        return true;
        
    if (value1 == null || value2 == null)
        return false;
        
    if (value1.first && value1.next)
        if (value2.first && value2.next)
            return cljs.core.equals(value1.first(), value2.first()) && cljs.core.equals(value1.next(), value2.next());
        else
            return false;
        
    return false;
}

cljs.core.str = function () {
    var result = '';
    var l = arguments.length;
    
    for (var k = 0; k < l; k++) {
        var arg = arguments[k];
        if (arg.asString)
            result += arg.asString();
        else
            result += arg.toString();
    }
    
    return result;
}

cljs.core.throw = function (ex) { throw ex; }