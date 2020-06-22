
require('./core');

const path = require('path');
const fs = require('fs');
const parsers = require('./parser');
const compiler = require('./compiler');

const lists = require('./list');
const symbols = require('./symbol');
const maps = require('./map');
const sets = require('./set');
const keywords = require('./keyword');
const vectors = require('./vector');
const recurs = require('./recur');
const loops = require('./loop');
const lazyseqs = require('./lazyseq');

const ns = require('./ns');

let source = null;
const required = [];
let currentctx = null;

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

cljs.core.require = function (name, force) {
    if (!source && currentctx && currentctx.currentfile && currentctx.currentfile.filename && currentctx.currentfile.namespace)
        source = ns.toSource(currentctx.currentfile.filename, currentctx.currentfile.namespace);
        
    if (symbols.isSymbol(name))
        name = name.name();
        
    requireNamespace(name, currentctx, force);
};

function makeRest(args, n) {
    if (!args || args.length <= n)
        return null;
        
    const result = [];
    
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
    const parser = parsers.parser(text);
    let result = null;
    
    while (parser.hasToken()) {
        const expr = parser.parse();
        const code = compiler.compile(expr);
        result = eval(code);
    }
        
    return result;
}

function execute(text, context) {
    const parser = parsers.parser(text);
    
    while (parser.hasToken()) {
        const expr = parser.parse();
        const code = compiler.compile(expr, context);

        if (!code)
            continue;

        eval(code + ";\n");
    }
}

function compile(text, context) {
    const parser = parsers.parser(text);
    let result = '';
    
    while (parser.hasToken()) {
        const expr = parser.parse();
        const code = compiler.compile(expr, context);
        
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

    const oldctx = currentctx;

    currentctx = context;

    const oldfile = context.currentfile;

    context.currentfile = { filename: filename };

    const code = fs.readFileSync(filename).toString();

    execute(code, context);
    context.currentfile = oldfile;
    currentctx = oldctx;
}

function compileFile(sourcefile, targetfile, context) {
    context = context || {};

    const text = fs.readFileSync(sourcefile).toString();
    const code = compile(text, context) + '\n';

    fs.writeFileSync(targetfile, code);
}

function setSource(src) {
    source = src;
}

function requireNamespace(nsname, context, force) {
    if (!force && required.indexOf(nsname) >= 0)
        return;

    const filename = ns.resolveFilename(source, nsname);
    
    if (!filename)
        throw new Error("Cannot resolve namespace '" + nsname + "'");
    
    required.push(nsname);
        
    executeFile(filename, context);
}

function loadConfiguration(filename) {
    const conf = require(filename);
    const dirname = path.dirname(filename);
    
    if (conf.sourcePath) {
        if (Array.isArray(conf.sourcePath)) {
            source = [];

            for (let n in conf.sourcePath)
                source.push(path.join(dirname, conf.sourcePath[n]));
        }
        else
            source = path.join(dirname, conf.sourcePath);
    }
}

executeFile(path.join(__dirname, '..', 'src', 'core.cljs'));

module.exports = {
    evaluate: evaluate,
    execute: execute,
    executeFile: executeFile,
    compile: compile,
    compileFile: compileFile,
    setSource: setSource,
    requireNamespace: requireNamespace,
    loadConfiguration: loadConfiguration
};

