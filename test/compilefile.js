
var clojjs = require('..');
var symbols = require('../lib/symbol');
var lists = require('../lib/list');
var parsers = require('../lib/parser');
var path = require('path');
var fs = require('fs');

function compile(name, expected, test) {
    var sourcefile = path.join(__dirname, 'files', name + '.cljs');
    var targetfile = path.join(__dirname, 'output', name + '.js');
    clojjs.compileFile(sourcefile, targetfile);
    var result = fs.readFileSync(targetfile).toString();
    test.strictEqual(result, expected + '\n');
}

exports['Compile integer to file'] = function (test) {
    compile('integer', '42', test);
};

exports['Compile string'] = function (test) {
    compile('string', '"foo"', test);
};

exports['Compile nil'] = function (test) {
    compile('nil', 'null', test);
};

exports['Compile symbol in default namespace'] = function (test) {
    compile('symbol', 'cljs.core.first', test);
};
