
var clojjs = require('..');
var path = require('path');

exports['Load simple project'] = function (test) {
    clojjs.loadConfiguration(path.join(__dirname, 'projects', 'simple', 'clojjs.json'));
    clojjs.requireNamespace('myapp.core', {});
    test.ok(myapp);
    test.ok(myapp.core);
    test.ok(myapp.core.answer);
    test.equal(myapp.core.answer, 42);
}