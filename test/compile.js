
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

exports['Compile nil'] = function (test) {
    test.strictEqual(clojjs.compile('nil'), 'null');
};

exports['Compile symbol in default namespace'] = function (test) {
    test.equal(clojjs.compile('first'), 'cljs.core.first');
};

exports['Compile symbol with namespace'] = function (test) {
    test.equal(clojjs.compile('ns/first'), 'ns.first');
};

exports['Compile def in default namespace'] = function (test) {
    test.equal(clojjs.compile('(def one 1)'), 'cljs.core.one = 1');
};

exports['Compile def in current namespace'] = function (test) {
    var context = { currentns: 'user' };
    test.equal(clojjs.compile('(def one 1)', context), 'user.one = 1');
    
    test.ok(context.nss);
    test.ok(context.nss.user.vars);
    test.ok(context.nss.user.vars.indexOf('one') >= 0);
};

exports['Compile symbol with qualified namespace'] = function (test) {
    test.equal(clojjs.compile('core.logic/first'), 'core.logic.first');
};

exports['Compile symbol in js namespace'] = function (test) {
    test.equal(clojjs.compile('js/console'), 'console');
};

exports['Compile native invoke with initial dot'] = function (test) {
    test.equal(clojjs.compile('(.log js/console (1 (+ 1 1)))'), 'console.log(1, (1) + (1))');
};

exports['Compile local symbol'] = function (test) {
    test.equal(clojjs.compile('x', { locals: [ 'x', 'y' ] }), 'x');
};
