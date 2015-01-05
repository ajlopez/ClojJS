
var maps = require('../lib/map');

exports['Create map'] = function (test) {
    var map = maps.create(["one", 1, "two", 2, "three", 3]);
    
    test.ok(map);
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
};

exports['Create and modify map'] = function (test) {
    var map = maps.create(["one", 1, "two", 2, "three", 3]);
    
    var map2 = map.set("three", 4);
    
    test.ok(map);
    test.equal(map.get("one"), 1);
    test.equal(map.get("two"), 2);
    test.equal(map.get("three"), 3);
    
    test.ok(map2);
    test.equal(map2.get("one"), 1);
    test.equal(map2.get("two"), 2);
    test.equal(map2.get("three"), 4);
};
