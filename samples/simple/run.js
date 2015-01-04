
var fs = require('fs');
var clojjs = require('../..');

clojjs.evaluate(fs.readFileSync(process.argv[2]).toString());



