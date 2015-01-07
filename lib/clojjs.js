
require('./core');

var path = require('path');
var parsers = require('./parser');
var compiler = require('./compiler');
var lists = require('./list');
var fs = require('fs');

cljs.core.load_HY_file = function (filename, context) { executeFile(filename, context); };
cljs.core.load_HY_file.macro = true;
cljs.core.load_HY_file.ctx = true;

cljs.core.load = function (name, context) { 
    var filename = name + ".cljs";
    
    if (currentfile && currentfile.filename)
        filename = path.join(path.dirname(currentfile.filename), filename);
    
    executeFile(filename, context); 
};

cljs.core.load.macro = true;
cljs.core.load.ctx = true;

var currentfile = { };

function makeRest(args, n) {
    if (!args || args.length <= n)
        return null;
        
    var result = [];
    
    for (var k = n; k < args.length; k++)
        result.push(args[k]);
    
    return lists.create(result);
}

function evaluate(text) {
    var parser = parsers.parser(text);
    var result = null;
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse()) {
        var code = compiler.compile(expr);
        result = eval(code);
    }
        
    return result;
}

function execute(text, context) {
    var parser = parsers.parser(text);
    var result = null;
    
    for (var expr = parser.parse(); expr != null; expr = parser.parse())
        eval(compiler.compile(expr, context) + ";\n");
}

function executeFile(filename, context) {
    var oldfile = currentfile;
    currentfile = { filename: filename };
    var code = fs.readFileSync(filename).toString();
    execute(code, context);
    currentfile = oldfile;
}

module.exports = {
    evaluate: evaluate,
    execute: execute,
    executeFile: executeFile
}