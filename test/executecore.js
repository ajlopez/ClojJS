
var clojjs = require('..');
var path = require('path');

exports['Execute core file'] = function (test) {
    clojjs.executeFile(path.join(__dirname, 'files', 'core.cljs'), {});
    
    test.ok(cljs.core.defmacro);
    test.ok(cljs.core.defmacro.macro);
    test.ok(cljs.core.defn);
    test.ok(cljs.core.defn.macro);

    test.ok(cljs.core.second);
    test.ok(cljs.core.ffirst);
    test.ok(cljs.core.nfirst);
    test.ok(cljs.core.fnext);
    test.ok(cljs.core.nnext);
};

exports['Evaluate second'] = function (test) {
    test.equal(clojjs.evaluate("(second '(1 2 3))"), 2);
    test.equal(clojjs.evaluate("(second '(1 (2 3) 4))").asString(), '(2 3)');
};

exports['Evaluate ffirst'] = function (test) {
    test.equal(clojjs.evaluate("(ffirst '((1) 2 3))"), 1);
    test.equal(clojjs.evaluate("(ffirst '((1 2) (2 3) 4))"), 1);
};
