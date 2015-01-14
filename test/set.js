
var sets = require('../lib/set');
var keywords = require('../lib/keyword');

exports['Create set'] = function (test) {
    var set = sets.create(["one", "two", "three"]);
    
    test.ok(set);
    test.ok(set.has("one"));
    test.ok(set.has("two"));
    test.ok(set.has("three"));
};

exports['Create set with keywords'] = function (test) {
    var set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    
    test.ok(set);
    test.ok(set.has(keywords.keyword("one")));
    test.ok(set.has(keywords.keyword("two")));
    test.ok(set.has(keywords.keyword("three")));
};

exports['Set as string'] = function (test) {
    var set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    
    test.ok(set);
    test.equal(set.asString(), "#{:one :two :three}");
};

exports['Set as object'] = function (test) {
    var set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    var result = set.asObject();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.one, true);
    test.equal(result.two, true);
    test.equal(result.three, true);
};

exports['Set as array'] = function (test) {
    var set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    var result = set.asArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.ok(result.length, 3);
    test.ok(keywords.isKeyword(result[0]));
    test.ok(keywords.isKeyword(result[1]));
    test.ok(keywords.isKeyword(result[2]));
    test.equal(result[0].name(), "one");
    test.equal(result[1].name(), "two");
    test.equal(result[2].name(), "three");
};

exports['Set as nested array'] = function (test) {
    var set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three"), sets.create([keywords.keyword("four"), keywords.keyword("five")])]);
    var result = set.asArray();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.ok(result.length, 4);
    test.ok(keywords.isKeyword(result[0]));
    test.ok(keywords.isKeyword(result[1]));
    test.ok(keywords.isKeyword(result[2]));
    test.ok(Array.isArray(result[3]));
    test.equal(result[3].length, 2);
    test.equal(result[0].name(), "one");
    test.equal(result[1].name(), "two");
    test.equal(result[2].name(), "three");
    test.ok(keywords.isKeyword(result[3][0]));
    test.ok(keywords.isKeyword(result[3][1]));
    test.equal(result[3][0].name(), "four");
    test.equal(result[3][1].name(), "five");
};

exports['Create and modify set'] = function (test) {
    var set = sets.create(["one", "two", "three"]);
    
    var set2 = set.add("four");
    
    test.ok(set);
    test.ok(set.has("one"));
    test.ok(set.has("two"));
    test.ok(set.has("three"));
    test.ok(!set.has("four"));
    
    test.ok(set2);
    test.ok(set2.has("one"));
    test.ok(set2.has("two"));
    test.ok(set2.has("three"));
    test.ok(set2.has("four"));
};

exports['Add existing key'] = function (test) {
    var set = sets.create(["one", "two", "three"]);
    
    var set2 = set.add("two");
    
    test.strictEqual(set2, set);
};

exports['Remove key'] = function (test) {
    var set = sets.create(["one", "two", "three"]);
    
    var set2 = set.remove("two");
    
    test.ok(set);
    test.ok(set.has("one"));
    test.ok(set.has("two"));
    test.ok(set.has("three"));
    test.ok(!set.has("four"));
    
    test.ok(set2);
    test.ok(set2.has("one"));
    test.ok(!set2.has("two"));
    test.ok(set2.has("three"));
    test.ok(!set2.has("four"));
};
