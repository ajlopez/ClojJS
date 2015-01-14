
var parsers = require('../lib/parser');
var symbols = require('../lib/symbol');
var keywords = require('../lib/keyword');
var lists = require('../lib/list');
var vectors = require('../lib/vector');
var maps = require('../lib/map');
var sets = require('../lib/set');

exports['Parse empty text'] = function (test) {
    var parser = parsers.parser('');
    
    var result = parser.parse();
    
    test.strictEqual(result, null);

    test.strictEqual(parser.parse(), null);
}

exports['Parse integer'] = function (test) {
    var parser = parsers.parser('42');
    
    var result = parser.parse();
    
    test.ok(result);
    test.strictEqual(result, 42);

    test.strictEqual(parser.parse(), null);
}

exports['Parse string'] = function (test) {
    var parser = parsers.parser('"foo"');
    
    var result = parser.parse();
    
    test.ok(result);
    test.strictEqual(result, "foo");

    test.strictEqual(parser.parse(), null);
}

exports['Parse nil'] = function (test) {
    var parser = parsers.parser('nil');
    
    var result = parser.parse();
    
    test.strictEqual(result, null);

    test.strictEqual(parser.parse(), null);
}

exports['Parse booleans'] = function (test) {
    var parser = parsers.parser('false true');
    
    var result = parser.parse();
    
    test.strictEqual(result, false);
    
    var result = parser.parse();
    
    test.strictEqual(result, true);

    test.strictEqual(parser.parse(), null);
}

exports['Parse symbol'] = function (test) {
    var parser = parsers.parser('first');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(symbols.isSymbol(result));
    test.equal(result.name(), 'first');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse keyword'] = function (test) {
    var parser = parsers.parser(':name');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(keywords.isKeyword(result));
    test.equal(result.name(), 'name');
    test.equal(result.asString(), ':name');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list'] = function (test) {
    var parser = parsers.parser('(1 2 (3 4))');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    test.equal(result.asString(), '(1 2 (3 4))');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with vector'] = function (test) {
    var parser = parsers.parser('(1 2 [3 4] 5)');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    test.equal(result.asString(), '(1 2 [3 4] 5)');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with fn'] = function (test) {
    var parser = parsers.parser('(fn [x y] (list x y))');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    test.equal(result.asString(), '(fn [x y] (list x y))');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse vector'] = function (test) {
    var parser = parsers.parser('[1 2 3 4]');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(vectors.isVector(result));
    test.equal(result.asString(), '[1 2 3 4]');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse vector with list'] = function (test) {
    var parser = parsers.parser('[1 (list 2 3) 4]');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(vectors.isVector(result));
    test.equal(result.asString(), '[1 (list 2 3) 4]');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse vector with vector'] = function (test) {
    var parser = parsers.parser('[1 [2 3] 4]');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(vectors.isVector(result));
    test.equal(result.asString(), '[1 [2 3] 4]');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse map'] = function (test) {
    var parser = parsers.parser('{ "one" 1 "two" 2 }');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(maps.isMap(result));
    test.equal(result.get("one"), 1);
    test.equal(result.get("two"), 2);
    test.equal(result.get("three"), null);
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with map'] = function (test) {
    var parser = parsers.parser('(to-object { "one" 1 "two" 2 })');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    
    result = result.next().first();
    
    test.ok(maps.isMap(result));
    test.equal(result.get("one"), 1);
    test.equal(result.get("two"), 2);
    test.equal(result.get("three"), null);
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse map with keywords'] = function (test) {
    var parser = parsers.parser('{ :one 1 :two 2 }');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(maps.isMap(result));
    test.equal(result.get(keywords.keyword("one")), 1);
    test.equal(result.get(keywords.keyword("two")), 2);
    test.equal(result.get(keywords.keyword("three")), null);
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse set'] = function (test) {
    var parser = parsers.parser('#{ "one" "two" }');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(sets.isSet(result));
    test.ok(result.has("one"));
    test.ok(result.has("two"));
    test.ok(!result.has("three"));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with set'] = function (test) {
    var parser = parsers.parser('(to-array #{ "one" "two" })');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    
    result = result.next().first();
    
    test.ok(sets.isSet(result));
    test.ok(result.has("one"));
    test.ok(result.has("two"));
    test.ok(!result.has("three"));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse set with keywords'] = function (test) {
    var parser = parsers.parser('#{ :one :two }');
    
    var result = parser.parse();
    
    test.ok(result);
    test.ok(sets.isSet(result));
    test.ok(result.has(keywords.keyword("one")));
    test.ok(result.has(keywords.keyword("two")));
    test.ok(!result.has(keywords.keyword("three")));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse quote name'] = function (test) {
    var parser = parsers.parser("'x");
    
    var result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(quote x)");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse quote list'] = function (test) {
    var parser = parsers.parser("'(1 2)");
    
    var result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(quote (1 2))");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse backquote name'] = function (test) {
    var parser = parsers.parser("`x");
    
    var result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(backquote x)");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse backquote list'] = function (test) {
    var parser = parsers.parser("`(1 2)");
    
    var result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(backquote (1 2))");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse unquote name'] = function (test) {
    var parser = parsers.parser("~x");
    
    var result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(unquote x)");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse unquote-splicing name'] = function (test) {
    var parser = parsers.parser("~@x");
    
    var result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(unquote-splicing x)");
    
    test.strictEqual(parser.parse(), null);
}


