
var clojjs = require('..');
var symbols = require('../lib/symbol');
var lists = require('../lib/list');
var parsers = require('../lib/parser');

exports['Compile integer'] = function (test) {
    test.strictEqual(clojjs.compile('42'), '42');
};

exports['Compile string'] = function (test) {
    test.strictEqual(clojjs.compile('"foo"'), '"foo"');
};

/*
exports['Compile nil'] = function (test) {
    test.strictEqual(clojjs.compile('nil'), 'null');
};
*/

exports['Compile symbol in default namespace'] = function (test) {
    test.equal(clojjs.compile('first'), 'cljs.core.first');
};

exports['Compile symbol with namespace'] = function (test) {
    test.equal(clojjs.compile('ns/first'), 'ns.first');
};

exports['Compile def in default namespace'] = function (test) {
    test.equal(clojjs.compile('(def one 1)'), 'cljs.core.one = 1');
};
