
var clojjs = require('..');
var symbols = require('../lib/symbol');
var lists = require('../lib/list');
var parsers = require('../lib/parser');
var path = require('path');
var fs = require('fs');

exports['Compile integer to file'] = function (test) {
    var sourcefile = path.join(__dirname, 'files', 'integer.cljs');
    var targetfile = path.join(__dirname, 'output', 'integer.js');
    clojjs.compileFile(sourcefile, targetfile);
    var result = fs.readFileSync(targetfile).toString();
    test.strictEqual(result, '42\n');
};

exports['Compile string'] = function (test) {
    var sourcefile = path.join(__dirname, 'files', 'string.cljs');
    var targetfile = path.join(__dirname, 'output', 'string.js');
    clojjs.compileFile(sourcefile, targetfile);
    var result = fs.readFileSync(targetfile).toString();
    test.strictEqual(result, '"foo"\n');
};

exports['Compile nil'] = function (test) {
    var sourcefile = path.join(__dirname, 'files', 'nil.cljs');
    var targetfile = path.join(__dirname, 'output', 'nil.js');
    clojjs.compileFile(sourcefile, targetfile);
    var result = fs.readFileSync(targetfile).toString();
    test.strictEqual(result, 'null\n');
};

exports['Compile symbol in default namespace'] = function (test) {
    var sourcefile = path.join(__dirname, 'files', 'symbol.cljs');
    var targetfile = path.join(__dirname, 'output', 'symbol.js');
    clojjs.compileFile(sourcefile, targetfile);
    var result = fs.readFileSync(targetfile).toString();
    test.equal(result, 'cljs.core.first\n');
};
