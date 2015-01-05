
var fs = require('fs');
var clojjs = require('../..');

clojjs.execute(fs.readFileSync(process.argv[2]).toString());



