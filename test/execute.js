
var clojjs = require('..');

exports['Execute def'] = function (test) {
    if (cljs && cljs.core && cljs.core.one)
        delete cljs.core.one;
        
    clojjs.execute('(def one 1)');
    test.ok(cljs.core.one);
    test.equal(cljs.core.one, 1);
};

exports['Execute two defs'] = function (test) {
    if (cljs && cljs.core && cljs.core.one)
        delete cljs.core.one;
    if (cljs && cljs.core && cljs.core.two)
        delete cljs.core.two;
        
    clojjs.execute('(def one 1) (def two 2)');
    test.ok(cljs.core.one);
    test.equal(cljs.core.one, 1);
    test.ok(cljs.core.two);
    test.equal(cljs.core.two, 2);
};

exports['Execute ns'] = function (test) {
    var context = { };
    clojjs.execute('(ns mypackage1.mycore1)', context);
    test.ok(mypackage1);
    test.equal(typeof mypackage1, 'object');
    test.ok(mypackage1.mycore1);
    test.equal(typeof mypackage1.mycore1, 'object');
    
    test.equal(context.currentns, 'mypackage1.mycore1');
    test.ok(context.nss['mypackage1.mycore1']);
};

exports['Execute def in my ns'] = function (test) {
    var context = { };
    clojjs.execute('(ns mypackage1.mycore2) (def one 1)', context);
    test.ok(mypackage1);
    test.equal(typeof mypackage1, 'object');
    test.ok(mypackage1.mycore2);
    test.equal(typeof mypackage1.mycore2, 'object');
    test.ok(mypackage1.mycore2.one);
    test.equal(mypackage1.mycore2.one, 1);
};
