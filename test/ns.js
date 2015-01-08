
var ns = require('../lib/ns');
var path = require('path');

exports['Namespace is valid'] = function (test) {
    test.equal(ns.isValid('user'), true);
    test.equal(ns.isValid('user.core'), true);
};

exports['Namespace is invalid'] = function (test) {
    test.equal(ns.isValid(null), false);
    test.equal(ns.isValid(''), false);
    test.equal(ns.isValid('   '), false);
    test.equal(ns.isValid('1234'), false);
    test.equal(ns.isValid('ABC'), false);
    test.equal(ns.isValid('abC'), false);
    test.equal(ns.isValid('user..core'), false);
};

exports['To filename'] = function (test) {
    test.equal(ns.toFilename('./src', 'user.core').replace(/\\/g, "/"), 'src/user/core.cljs');
    test.equal(ns.toFilename('./src', 'user').replace(/\\/g, "/"), 'src/user.cljs');
    test.equal(ns.toFilename(path.resolve('./src'), 'user.core'), path.resolve('./src/user/core.cljs'));
};

exports['To source folder'] = function (test) {
    test.equal(ns.toSource('./src/user/core.cljs', 'user.core').replace(/\\/g, "/"), './src');
    test.equal(ns.toSource('./src/user.cljs', 'user').replace(/\\/g, "/"), './src');
    test.equal(ns.toSource(path.resolve('./src/cljs/user/core.cljs'), 'user.core'), path.resolve('./src/cljs'));
};
