
var vectors = require('../lib/vector');

exports['Create vector'] = function (test) {
    var vector = vectors.create([1, 2, 3]);
    
    test.ok(vector);
    test.equal(vector.length(), 3);
    test.equal(vector.get(0), 1);
    test.equal(vector.get(1), 2);
    test.equal(vector.get(2), 3);
    
    test.deepEqual(vector.asArray(), [1, 2, 3]);
};

exports['Call vector'] = function (test) {
    var vector = vectors.create([1, 2, 3]);
    
    test.ok(vector);
    test.equal(vector.length(), 3);
    test.equal(vector.call(null, 0), 1);
    test.equal(vector.call(null, 1), 2);
    test.equal(vector.call(null, 2), 3);

    test.throws(
        function () {
            vector.call(null, 3);
        },
        "Index out of bounds"
    );

    test.throws(
        function () {
            vector.call(null, -1);
        },
        "Index out of bounds"
    );
};

exports['Index out of bounds'] = function (test) {
    var vector = vectors.create([1, 2, 3]);
    
    test.throws(
        function () {
            vector.nth(3);
        },
        "Index out of bounds"
    );
    
    test.throws(
        function () {
            vector.nth(-1);
        },
        "Index out of bounds"
    );
};

exports['Vector has key'] = function (test) {
    var vector = vectors.create([1, 2, 3]);
    
    test.ok(vector);
    test.equal(vector.length(), 3);
    test.ok(vector.has(0));
    test.ok(vector.has(1));
    test.ok(vector.has(2));
    test.ok(!vector.has(-1));
    test.ok(!vector.has(3));
    test.ok(!vector.has(4));
    test.ok(!vector.has("foo"));
};

exports['Vectors as string'] = function (test) {
    test.equal(vectors.create([1, 2, 3]).asString(), "[1 2 3]");
    test.equal(vectors.create([1, 2]).asString(), "[1 2]");
    test.equal(vectors.create([]).asString(), "[]");
};

exports['Is vector'] = function (test) {
    test.ok(vectors.isVector(vectors.create([1])));
    test.ok(vectors.isVector(vectors.create([1, 2, 3])));
    test.ok(!vectors.isVector(null));
    test.ok(!vectors.isVector(false));
    test.ok(!vectors.isVector(true));
    test.ok(!vectors.isVector(42));
    test.ok(!vectors.isVector("foo"));
};