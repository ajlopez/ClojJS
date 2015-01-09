
var clojjs = require('..');
var path = require('path');

exports['Execute def'] = function (test) {
    if (cljs && cljs.core && cljs.core.one)
        delete cljs.core.one;
        
    clojjs.execute('(def one 1)');
    test.ok(cljs.core.one);
    test.equal(cljs.core.one, 1);
};

exports['Execute two defs'] = function (test) {
    if (cljs && cljs.core && cljs.core.one)
        delete cljs.core.one;
    if (cljs && cljs.core && cljs.core.two)
        delete cljs.core.two;
        
    clojjs.execute('(def one 1) (def two 2)');
    test.ok(cljs.core.one);
    test.equal(cljs.core.one, 1);
    test.ok(cljs.core.two);
    test.equal(cljs.core.two, 2);
};

exports['Execute ns'] = function (test) {
    var context = { };
    clojjs.execute('(ns mypackage1.mycore1)', context);
    test.ok(mypackage1);
    test.equal(typeof mypackage1, 'object');
    test.ok(mypackage1.mycore1);
    test.equal(typeof mypackage1.mycore1, 'object');
    
    test.equal(context.currentns, 'mypackage1.mycore1');
    test.ok(context.nss['mypackage1.mycore1']);
};

exports['Execute def in my ns'] = function (test) {
    var context = { };
    clojjs.execute('(ns mypackage1.mycore2) (def one 1)', context);
    test.ok(mypackage1);
    test.equal(typeof mypackage1, 'object');
    test.ok(mypackage1.mycore2);
    test.equal(typeof mypackage1.mycore2, 'object');
    test.ok(mypackage1.mycore2.one);
    test.equal(mypackage1.mycore2.one, 1);
};

exports['Define and Expand macro'] = function (test) {
    var context = { };
    clojjs.execute('(def myapply (fn [x] (cons x (cons 1 (cons 2 nil))))) (set! (. myapply macro) true) (def two (myapply list))', context);
    test.ok(cljs.core.myapply);
    test.ok(cljs.core.two);
    test.equal(cljs.core.two.asString(), '(1 2)');
};

exports['Execute file'] = function (test) {
    delete global.files;
    
    clojjs.executeFile(path.join(__dirname, 'files', 'loadedfile.cljs'), {});
    
    test.ok(files);
    test.ok(files.loadedfile);
    test.ok(files.loadedfile.loaded);
};

exports['Execute load-file'] = function (test) {
    delete global.files;
    
    var filename = path.join(__dirname, 'files', 'loadedfile.cljs');
    clojjs.execute('(load-file "' + filename + '")', {});
    
    test.ok(files);
    test.ok(files.loadedfile);
    test.ok(files.loadedfile.loaded);
};

exports['Execute load in file'] = function (test) {
    delete global.files;
    
    var filename = path.join(__dirname, 'files', 'loader.cljs');
    clojjs.execute('(load-file "' + filename + '")', {});
    
    test.ok(files);
    test.ok(files.loader);
    test.ok(files.loader.loaded);
};

exports['Execute defn file'] = function (test) {
    clojjs.executeFile(path.join(__dirname, 'files', 'defn.cljs'), {});
    
    test.ok(cljs.core.defmacro);
    test.ok(cljs.core.defmacro.macro);
    test.ok(cljs.core.defn);
    test.ok(cljs.core.defn.macro);
    test.ok(cljs.core.inc);
    
    test.equal(cljs.core.inc(1), 2);
};

exports['Execute file with require'] = function (test) {
    clojjs.setSource(null);
    clojjs.executeFile(path.join(__dirname, 'src', 'lib', 'core.cljs'), {});
    
    test.ok(lib);
    test.ok(lib.core);
    test.ok(sublib);
    test.ok(sublib.core);
    test.ok(sublib.core.one);
    test.equal(sublib.core.one, 1);
};
