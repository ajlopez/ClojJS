
var clojjs = require('..');
var fs = require('fs');
var path = require('path');

exports['Execute is files'] = function (test) {
    var filenames = fs.readdirSync(path.join(__dirname, 'is'));
    filenames.forEach(function (filename) {
        console.log();
        clojjs.executeFile(path.join(__dirname, 'is', filename));
    });
};