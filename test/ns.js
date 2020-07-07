
const ns = require('../lib/ns');
const path = require('path');

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
    test.equal(ns.toFilename('user.core').replace(/\\/g, "/"), 'user/core.cljs');
    test.equal(ns.toFilename('user').replace(/\\/g, "/"), 'user.cljs');
};

exports['Resolve filename'] = function (test) {
    test.equal(ns.resolveFilename('test/files', 'user.core'), null);
    test.equal(ns.resolveFilename('test/src', 'user.core').replace(/\\/g, "/"), 'test/src/user/core.cljs');
    test.equal(ns.resolveFilename('test/src', 'user').replace(/\\/g, "/"), 'test/src/user.cljs');
    test.equal(ns.resolveFilename(path.resolve('test/src'), 'user.core'), path.resolve('test/src/user/core.cljs'));
};

exports['Resolve filename using source array'] = function (test) {
    test.equal(ns.resolveFilename(['test/files'], 'user.core'), null);
    test.equal(ns.resolveFilename(['test/files', 'test/src'], 'user.core').replace(/\\/g, "/"), 'test/src/user/core.cljs');
    test.equal(ns.resolveFilename(['test/files', 'test/src'], 'user').replace(/\\/g, "/"), 'test/src/user.cljs');
    test.equal(ns.resolveFilename([path.resolve('test/files'), path.resolve('test/src')], 'user.core'), path.resolve('test/src/user/core.cljs'));
};

exports['To source folder'] = function (test) {
    test.equal(ns.toSource('./src/user/core.cljs', 'user.core').replace(/\\/g, "/"), './src');
    test.equal(ns.toSource('./src/user.cljs', 'user').replace(/\\/g, "/"), './src');
    test.equal(ns.toSource(path.resolve('./src/cljs/user/core.cljs'), 'user.core'), path.resolve('./src/cljs'));
};
