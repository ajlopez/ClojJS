
const parsers = require('../lib/parser');
const symbols = require('../lib/symbol');
const keywords = require('../lib/keyword');
const lists = require('../lib/list');
const vectors = require('../lib/vector');
const maps = require('../lib/map');
const sets = require('../lib/set');

exports['Parse empty text'] = function (test) {
    const parser = parsers.parser('');
    
    const result = parser.parse();
    
    test.strictEqual(result, null);

    test.strictEqual(parser.parse(), null);
}

exports['Has token on empty text'] = function (test) {
    const parser = parsers.parser('');
    
    test.equal(parser.hasToken(), false);
}

exports['Parse integer'] = function (test) {
    const parser = parsers.parser('42');
    
    const result = parser.parse();
    
    test.ok(result);
    test.strictEqual(result, 42);

    test.strictEqual(parser.parse(), null);
}

exports['Has token on integer'] = function (test) {
    const parser = parsers.parser('42');
    
    test.equal(parser.hasToken(), true);
}

exports['Parse string'] = function (test) {
    const parser = parsers.parser('"foo"');
    
    const result = parser.parse();
    
    test.ok(result);
    test.strictEqual(result, "foo");

    test.strictEqual(parser.parse(), null);
}

exports['Parse nil'] = function (test) {
    const parser = parsers.parser('nil');
    
    const result = parser.parse();
    
    test.strictEqual(result, null);

    test.strictEqual(parser.parse(), null);
}

exports['Parse booleans'] = function (test) {
    const parser = parsers.parser('false true');
    
    const result = parser.parse();
    
    test.strictEqual(result, false);
    
    const result2 = parser.parse();
    
    test.strictEqual(result2, true);

    test.strictEqual(parser.parse(), null);
}

exports['Parse symbol'] = function (test) {
    const parser = parsers.parser('first');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(symbols.isSymbol(result));
    test.equal(result.name(), 'first');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse keyword'] = function (test) {
    const parser = parsers.parser(':name');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(keywords.isKeyword(result));
    test.equal(result.name(), 'name');
    test.equal(result.asString(), ':name');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list'] = function (test) {
    const parser = parsers.parser('(1 2 (3 4))');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    test.equal(result.asString(), '(1 2 (3 4))');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with vector'] = function (test) {
    const parser = parsers.parser('(1 2 [3 4] 5)');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    test.equal(result.asString(), '(1 2 [3 4] 5)');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with fn'] = function (test) {
    const parser = parsers.parser('(fn [x y] (list x y))');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    test.equal(result.asString(), '(fn [x y] (list x y))');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse vector'] = function (test) {
    const parser = parsers.parser('[1 2 3 4]');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(vectors.isVector(result));
    test.equal(result.asString(), '[1 2 3 4]');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse vector with list'] = function (test) {
    const parser = parsers.parser('[1 (list 2 3) 4]');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(vectors.isVector(result));
    test.equal(result.asString(), '[1 (list 2 3) 4]');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse vector with vector'] = function (test) {
    const parser = parsers.parser('[1 [2 3] 4]');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(vectors.isVector(result));
    test.equal(result.asString(), '[1 [2 3] 4]');
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse map'] = function (test) {
    const parser = parsers.parser('{ "one" 1 "two" 2 }');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(maps.isMap(result));
    test.equal(result.get("one"), 1);
    test.equal(result.get("two"), 2);
    test.equal(result.get("three"), null);
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with map'] = function (test) {
    const parser = parsers.parser('(to-object { "one" 1 "two" 2 })');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    
    const result2 = result.next().first();
    
    test.ok(maps.isMap(result2));
    test.equal(result2.get("one"), 1);
    test.equal(result2.get("two"), 2);
    test.equal(result2.get("three"), null);
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse map with keywords'] = function (test) {
    const parser = parsers.parser('{ :one 1 :two 2 }');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(maps.isMap(result));
    test.equal(result.get(keywords.keyword("one")), 1);
    test.equal(result.get(keywords.keyword("two")), 2);
    test.equal(result.get(keywords.keyword("three")), null);
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse set'] = function (test) {
    const parser = parsers.parser('#{ "one" "two" }');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(sets.isSet(result));
    test.ok(result.has("one"));
    test.ok(result.has("two"));
    test.ok(!result.has("three"));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse with integers'] = function (test) {
    const parser = parsers.parser('#{ 1 2 3 }');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(sets.isSet(result));
    test.ok(result.has(1));
    test.ok(result.has(2));
    test.ok(result.has(3));
    test.ok(!result.has(4));
    test.equal(result.asString(), '#{1 2 3}');
    test.ok(result.equals(sets.create([1,2,3])));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse list with set'] = function (test) {
    const parser = parsers.parser('(to-array #{ "one" "two" })');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(lists.isList(result));
    
    const result2 = result.next().first();
    
    test.ok(sets.isSet(result2));
    test.ok(result2.has("one"));
    test.ok(result2.has("two"));
    test.ok(!result2.has("three"));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse set with keywords'] = function (test) {
    const parser = parsers.parser('#{ :one :two }');
    
    const result = parser.parse();
    
    test.ok(result);
    test.ok(sets.isSet(result));
    test.ok(result.has(keywords.keyword("one")));
    test.ok(result.has(keywords.keyword("two")));
    test.ok(!result.has(keywords.keyword("three")));
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse quote name'] = function (test) {
    const parser = parsers.parser("'x");
    
    const result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(quote x)");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse quote list'] = function (test) {
    const parser = parsers.parser("'(1 2)");
    
    const result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(quote (1 2))");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse backquote name'] = function (test) {
    const parser = parsers.parser("`x");
    
    const result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(backquote x)");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse backquote list'] = function (test) {
    const parser = parsers.parser("`(1 2)");
    
    const result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(backquote (1 2))");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse unquote name'] = function (test) {
    const parser = parsers.parser("~x");
    
    const result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(unquote x)");
    
    test.strictEqual(parser.parse(), null);
}

exports['Parse unquote-splicing name'] = function (test) {
    const parser = parsers.parser("~@x");
    
    const result = parser.parse();
    
    test.ok(result);
    test.equal(result.asString(), "(unquote-splicing x)");
    
    test.strictEqual(parser.parse(), null);
}


