
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
