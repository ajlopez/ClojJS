
var clojjs = require('..');

exports['Execute def'] = function (test) {
    clojjs.execute('(def one 1)');
    test.ok(cljs.core.one);
    test.equal(cljs.core.one, 1);
};