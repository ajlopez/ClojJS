
const clojjs = require('..');
const symbols = require('../lib/symbol');
const lists = require('../lib/list');
const parsers = require('../lib/parser');
const path = require('path');
const fs = require('fs');

function compile(name, expected, test, contained) {
    const sourcefile = path.join(__dirname, 'files', name + '.cljs');
    const targetfile = path.join(__dirname, 'output', name + '.js');
    
    clojjs.compileFile(sourcefile, targetfile);
    
    const result = fs.readFileSync(targetfile).toString();
    
    if (contained)
        test.ok(result.indexOf(expected) >= 0);
    else
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

exports['Compile symbol with namespace'] = function (test) {
    compile('nssymbol', 'ns.first', test);
};

exports['Compile def in default namespace'] = function (test) {
    compile('defone', 'cljs.core.one = 1', test, true);
};

exports['Compile def in current namespace'] = function (test) {
    if (typeof user != 'undefined')
        delete user;
    
    compile('nsdefone', 'user.one = 1', test, true);
    test.ok(user);
    test.ok(user.one);
    test.equal(user.one, 1);
};
