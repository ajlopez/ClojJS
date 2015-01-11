
var lists = require('./list');

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

cljs.core.to_HY_object = function (value) {
    if (value == null)
        return {};
        
    return value.asObject();
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