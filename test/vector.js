
const vectors = require('../lib/vector');

exports['Create vector'] = function (test) {
    const vector = vectors.create([1, 2, 3]);
    
    test.ok(vector);
    test.equal(vector.length(), 3);
    test.equal(vector.get(0), 1);
    test.equal(vector.get(1), 2);
    test.equal(vector.get(2), 3);
    
    test.deepEqual(vector.asArray(), [1, 2, 3]);
};

exports['Create vector with nil'] = function (test) {
    const vector = vectors.create([null]);
    
    test.ok(vector);
    test.equal(vector.length(), 1);
    test.equal(vector.get(0), null);
    
    test.deepEqual(vector.asArray(), [null]);
};

exports['Call vector'] = function (test) {
    const vector = vectors.create([1, 2, 3]);
    
    test.ok(vector);
    test.equal(vector.length(), 3);
    test.equal(vector.call(null, 0), 1);
    test.equal(vector.call(null, 1), 2);
    test.equal(vector.call(null, 2), 3);

    test.throws(
        function () {
            vector.call(null, 3);
        },
        {
            message: "Index out of bounds"
        }
    );

    test.throws(
        function () {
            vector.call(null, -1);
        },
        {
            message: "Index out of bounds"
        }
    );
};

exports['Index out of bounds'] = function (test) {
    const vector = vectors.create([1, 2, 3]);
    
    test.throws(
        function () {
            vector.nth(3);
        },
        {
            message: "Index out of bounds"
        }
    );
    
    test.throws(
        function () {
            vector.nth(-1);
        },
        {
            message: "Index out of bounds"
        }
    );
};

exports['Vector has key'] = function (test) {
    const vector = vectors.create([1, 2, 3]);
    
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

exports['Assoc'] = function (test) {
    const vector = vectors.create([1, 2, 3]);
    const vector2 = vector.assoc([1, 3, 3, 4]);
    
    test.ok(!vector.equals(vector2));
    test.ok(!vector2.equals(vector));
    
    test.ok(vector2.get(0), 1);
    test.ok(vector2.get(1), 3);
    test.ok(vector2.get(2), 3);
    test.ok(vector2.get(3), 4);
};
