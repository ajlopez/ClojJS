
var lists = require('./list');

if (typeof cljs == 'undefined')
    cljs = {};
    
if (typeof cljs.core == 'undefined')
    cljs.core = {};
    
cljs.core.list = function () {
    return lists.create(arguments);
}

cljs.core.first = function (list) { return list.first(); }

cljs.core.next = function (list) { return list.next(); }

cljs.core.cons = function (first, next) { return lists.list(first, next); }