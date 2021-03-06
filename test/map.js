
const maps = require('../lib/map');
const keywords = require('../lib/keyword');

exports['Create map'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3]);
    
    test.ok(map);
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
};

exports['Create map with keywords'] = function (test) {
    const map = maps.create([keywords.keyword("one"), 1, keywords.keyword("two"), 2, keywords.keyword("three"), 3]);
    
    test.ok(map);
    test.equal(map.get(keywords.keyword("one")), 1);
    test.equal(map.get(keywords.keyword("two")), 2);
    test.equal(map.get(keywords.keyword("three")), 3);
};

exports['Map has key'] = function (test) {
    const map = maps.create([keywords.keyword("one"), null, keywords.keyword("two"), 2, keywords.keyword("three"), 3]);
    
    test.ok(map);

    test.ok(map.has(keywords.keyword("one")));
    test.ok(map.has(keywords.keyword("two")));
    test.ok(map.has(keywords.keyword("three")));
    test.ok(!map.has(keywords.keyword("four")));

    test.equal(map.get(keywords.keyword("one")), null);
    test.equal(map.get(keywords.keyword("two")), 2);
    test.equal(map.get(keywords.keyword("three")), 3);
    test.equal(map.get(keywords.keyword("four")), null);
};

exports['Map as string'] = function (test) {
    const map = maps.create([keywords.keyword("one"), 1, keywords.keyword("two"), 2, keywords.keyword("three"), 3]);
    
    test.ok(map);
    test.equal(map.asString(), "{:one 1 :two 2 :three 3}");
};

exports['Map as object'] = function (test) {
    const map = maps.create([keywords.keyword("one"), 1, keywords.keyword("two"), 2, keywords.keyword("three"), 3]);
    const result = map.asObject();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.one, 1);
    test.equal(result.two, 2);
    test.equal(result.three, 3);
};

exports['Map as nested object'] = function (test) {
    const map = maps.create([keywords.keyword("one"), 1, keywords.keyword("two"), 2, keywords.keyword("three"), maps.create([keywords.keyword("four"), 4, keywords.keyword("five"), 5])]);
    const result = map.asObject();
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(result.one, 1);
    test.equal(result.two, 2);
    test.equal(typeof result.three, 'object');
    test.equal(result.three.four, 4);
    test.equal(result.three.five, 5);
};

exports['Create and modify map'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3]);
    
    const map2 = map.set("three", 4);
    
    test.ok(map);
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
    
    test.ok(map2);
    test.equal(map2.get("one"), 1);
    test.equal(map2.get("two"), 2);
    test.equal(map2.get("three"), 4);
};

exports['Assoc'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3]);
    
    const map2 = map.assoc(["four", 4, "three", 0, "five", 5]);
    
    test.ok(map);
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
    
    test.ok(map2);
    test.equal(map2.get("one"), 1);
    test.equal(map2.get("two"), 2);
    test.equal(map2.get("three"), 0);
    test.equal(map2.get("four"), 4);
    test.equal(map2.get("five"), 5);
};

exports['Dissoc'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3, "four", 4]);
    
    const map2 = map.dissoc(["four", "two"]);
    
    test.ok(map);
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
    test.equal(map.get("four"), 4);
    
    test.ok(map2);
    test.equal(map2.get("one"), 1);
    test.equal(map2.get("two"), null);
    test.equal(map2.get("three"), 3);
    test.equal(map2.get("four"), null);
};

exports['Dissoc non existing keys'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3, "four", 4]);
    
    const map2 = map.dissoc(["five", "ten"]);
    
    test.ok(map);
    test.strictEqual(map2, map);
};

exports['Equals on same keys/values'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3]);
    const map2 = maps.create(["one", 1, "three", 3, "two", 2]);
    const map3 = maps.create(["one", 1, "two", 2, "three", 4]);
    const map4 = maps.create(["one", 1, "three", 4]);
    
    test.ok(map.equals(map2));
    test.ok(map2.equals(map));
    test.ok(!map.equals(map3));
    test.ok(!map2.equals(map3));
    test.ok(!map3.equals(map));
    test.ok(!map3.equals(map2));
    test.ok(!map.equals(map4));
    test.ok(!map4.equals(map));
    
    test.ok(!map.equals(42));
    test.ok(!map.equals(null));
    test.ok(!map.equals("foo"));
};

exports['Remove key'] = function (test) {
    const map = maps.create(["one", 1, "two", 2, "three", 3]);
    const map2 = map.remove("three");
    
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
    
    test.equal(map2.get("one"), 1);
    test.equal(map2.get("two"), 2);
    test.equal(map2.get("three"), null);
    test.ok(!map2.has("three"));
};

exports['Remove keyword'] = function (test) {
    const map = maps.create([keywords.keyword("one"), 1, keywords.keyword("two"), 2, keywords.keyword("three"), 3]);
    const map2 = map.remove(keywords.keyword("three"));
    
    test.equal(map.get(keywords.keyword("one")), 1);
    test.equal(map.get(keywords.keyword("two")), 2);
    test.equal(map.get(keywords.keyword("three")), 3);
    
    test.equal(map2.get(keywords.keyword("one")), 1);
    test.equal(map2.get(keywords.keyword("two")), 2);
    test.equal(map2.get(keywords.keyword("three")), null);
    test.ok(!map2.has(keywords.keyword("three")));
};

