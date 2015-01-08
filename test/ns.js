
var ns = require('../lib/ns');

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