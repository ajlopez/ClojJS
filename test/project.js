
const clojjs = require('..');
const path = require('path');

exports['Load simple project'] = function (test) {
    if (typeof myapp != 'undefined')
        delete myapp;
        
    clojjs.loadConfiguration(path.join(__dirname, 'projects', 'simple', 'clojjs.json'));
    clojjs.requireNamespace('myapp.core', {});
    test.ok(myapp);
    test.ok(myapp.core);
    test.ok(myapp.core.answer);
    test.equal(myapp.core.answer, 42);
}

exports['Execute require and load simple project'] = function (test) {
    if (typeof myapp != 'undefined')
        delete myapp;
        
    clojjs.loadConfiguration(path.join(__dirname, 'projects', 'simple', 'clojjs.json'));
    clojjs.execute("(require 'myapp.core true)", {});
    test.ok(myapp);
    test.ok(myapp.core);
    test.ok(myapp.core.answer);
    test.equal(myapp.core.answer, 42);
}

