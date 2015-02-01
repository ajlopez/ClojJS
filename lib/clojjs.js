
require('./core');

var path = require('path');
var parsers = require('./parser');
var compiler = require('./compiler');

var lists = require('./list');
var symbols = require('./symbol');
var maps = require('./map');
var sets = require('./set');
var keywords = require('./keyword');
var vectors = require('./vector');
var recurs = require('./recur');
var loops = require('./loop');
var lazyseqs = require('./lazyseq');

var ns = require('./ns');
var fs = require('fs');

var source = null;
var required = [];
var currentctx = null;

cljs.core.load_HY_file = function (filename, context) { executeFile(filename, context); };
cljs.core.load_HY_file.macro = true;
cljs.core.load_HY_file.ctx = true;

cljs.core.load = function (name, context) { 
    var filename = name + ".cljs";
    
    if (context && context.currentfile && context.currentfile.filename)
        filename = path.join(path.dirname(context.currentfile.filename), filename);
    
    executeFile(filename, context); 
};

cljs.core.load.macro = true;
cljs.core.load.ctx = true;

cljs.core.require = function (name) {
    if (!source && currentctx && currentctx.currentfile && currentctx.currentfile.filename && currentctx.currentfile.namespace)
        source = ns.toSource(currentctx.currentfile.filename, currentctx.currentfile.namespace);
        
    if (symbols.isSymbol(name))
        name = name.name();
        
    requireNamespace(name, currentctx);
};

function makeRest(args, n) {
    if (!args || args.length <= n)
        return null;
        
    var result = [];
    
    for (var k = n; k < args.length; k++)
        result.push(args[k]);
    
    return lists.create(result);
}

function asArray(value) {
    if (value == null)
        return [];
    
    return value.asArray();
}

function evaluate(text) {
    var parser = parsers.parser(text);
    var result = null;
    
    while (parser.hasToken()) {
        var expr = parser.parse();
        var code = compiler.compile(expr);
        result = eval(code);
    }
        
    return result;
}

function execute(text, context) {
    var parser = parsers.parser(text);
    
    while (parser.hasToken()) {
        var expr = parser.parse();
        var code = compiler.compile(expr, context);
        if (!code)
            continue;
        if (code[0] == '@')
            code = code.substring(1);
        else if (code[1] == '@')
            code = code[0] + code.substring(2);
        eval(code + ";\n");
    }
}

function compile(text, context) {
    var parser = parsers.parser(text);
    var result = '';
    
    while (parser.hasToken()) {
        var expr = parser.parse();
        var code = compiler.compile(expr, context);
        
        if (!code)
            continue;
            
        if (code.indexOf('//@@') >= 0)
            eval(code);
            
        if (result.length)
            result += '\n';
            
        result += code;
    }
    
    return result;
}

function executeFile(filename, context) {
    context = context || {};
    var oldctx = currentctx;
    currentctx = context;
    var oldfile = context.currentfile;
    context.currentfile = { filename: filename };
    var code = fs.readFileSync(filename).toString();
    execute(code, context);
    context.currentfile = oldfile;
    currentctx = oldctx;
}

function setSource(src) {
    source = src;
}

function requireNamespace(nsname, context, force) {
    if (!force && required.indexOf(nsname) >= 0)
        return;

    var filename = ns.resolveFilename(source, nsname);
    
    if (!filename)
        throw new Error("Cannot resolve namespace '" + nsname + "'");
    
    required.push(nsname);
        
    executeFile(filename, context);
}

executeFile(path.join(__dirname, '..', 'src', 'core.cljs'));

module.exports = {
    evaluate: evaluate,
    execute: execute,
    executeFile: executeFile,
    compile: compile,
    setSource: setSource,
    requireNamespace: requireNamespace
}

