
const clojjs = require('..');
const fs = require('fs');
const path = require('path');

exports['Execute is files'] = function (test) {
    const filenames = fs.readdirSync(path.join(__dirname, 'is'));
    
    filenames.forEach(function (filename) {
        console.log();
        clojjs.executeFile(path.join(__dirname, 'is', filename));
    });
};

