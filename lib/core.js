
var lists = require('./list');
var vectors = require('./vector');
var sets = require('./set');
var maps = require('./map');
var lazyseqs = require('./lazyseq');
var utils = require('./utils');

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
        var keys = value.getKeys();
        
        if (keys.length == 0)
            return null;
            
        return lists.create(keys);
    }
        
    if (lists.isList(value))
        return value;
        
    if (lazyseqs.isLazySeq(value))
        return value;
        
    if (maps.isMap(value)) {
        var result = [];
        var keys = value.getKeys();
        
        if (keys.length == 0)
            return null;
            
        for (var n in keys) {
            var key = keys[n];
            var val = value.get(key);
            result.push(vectors.create([key, val]));
        }        
        
        return lists.create(result);
    }
        
    if (typeof value == 'string')
        return lists.create(value.split(''));
        
    if (Array.isArray(value))
        return lists.create(value);

    throw new Error("Don't know how to create sequence from: " + value);
}

cljs.core.length = function (value) { return value.length(); }

cljs.core.equals = function (value1, value2) {
    return utils.equals(value1, value2);
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

function isEmpty(value) {
    if (value == null)
        return true;
        
    if (lists.isEmptyList(value))
        return true;
        
    if (value.isEmpty)
        return value.isEmpty();
        
    return false;
}