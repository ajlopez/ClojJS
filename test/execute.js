
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