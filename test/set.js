
const sets = require('../lib/set');
const keywords = require('../lib/keyword');

exports['Create set'] = function (test) {
    const set = sets.create(["one", "two", "three"]);
    
    test.ok(set);
    test.ok(set.has("one"));
    test.ok(set.has("two"));
    test.ok(set.has("three"));
};

exports['Create set with keywords'] = function (test) {
    const set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    
    test.ok(set);
    test.ok(set.has(keywords.keyword("one")));
    test.ok(set.has(keywords.keyword("two")));
    test.ok(set.has(keywords.keyword("three")));
};

exports['Set as string'] = function (test) {
    const set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    
    test.ok(set);
    test.equal(set.asString(), "#{:one :two :three}");
};

exports['Set as object'] = function (test) {
    const set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    const result = set.asObject();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.one, true);
    test.equal(result.two, true);
    test.equal(result.three, true);
};

exports['Set as array'] = function (test) {
    const set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    const result = set.asArray();
    
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
    const set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three"), sets.create([keywords.keyword("four"), keywords.keyword("five")])]);
    const result = set.asArray();
    
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
    const set = sets.create(["one", "two", "three"]);
    
    const set2 = set.add("four");
    
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
    const set = sets.create(["one", "two", "three"]);
    
    const set2 = set.add("two");
    
    test.strictEqual(set2, set);
};

exports['Remove key'] = function (test) {
    const set = sets.create(["one", "two", "three"]);
    
    const set2 = set.remove("two");
    
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

exports['Remove keyword key'] = function (test) {
    const set = sets.create([keywords.keyword("one"), keywords.keyword("two"), keywords.keyword("three")]);
    
    const set2 = set.remove(keywords.keyword("two"));
    
    test.ok(set);
    test.ok(set.has(keywords.keyword("one")));
    test.ok(set.has(keywords.keyword("two")));
    test.ok(set.has(keywords.keyword("three")));
    test.ok(!set.has(keywords.keyword("four")));
    
    test.ok(set2);
    test.ok(set2.has(keywords.keyword("one")));
    test.ok(!set2.has(keywords.keyword("two")));
    test.ok(set2.has(keywords.keyword("three")));
    test.ok(!set2.has(keywords.keyword("four")));
};

exports['Remove non existing key'] = function (test) {
    const set = sets.create(["one", "two", "three"]);
    
    const set2 = set.remove("four");
    
    test.strictEqual(set2, set);
};

exports['Equals on same keys/values'] = function (test) {
    const set = sets.create([ 1, 2, 3 ]);
    const set2 = sets.create([ 1, 3, 2 ]);
    const set3 = sets.create([ 1, 2, 4 ]);
    const set4 = sets.create([ 1, 4 ]);
    
    test.ok(set.equals(set2));
    test.ok(set2.equals(set));
    test.ok(!set.equals(set3));
    test.ok(!set2.equals(set3));
    test.ok(!set3.equals(set));
    test.ok(!set3.equals(set2));
    test.ok(!set.equals(set4));
    test.ok(!set4.equals(set));
    
    test.ok(!set.equals(42));
    test.ok(!set.equals(null));
    test.ok(!set.equals("foo"));
};
