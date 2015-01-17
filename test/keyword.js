
var keywords = require('../lib/keyword');

exports['Create keyword'] = function (test) {
    var keyword = keywords.keyword('foo');
    
    test.ok(keyword);
    test.equal(keyword.name(), 'foo');
    test.equal(keyword.asString(), ':foo');
};

exports['Is keyword'] = function (test) {
    var keyword = keywords.keyword('foo');
    
    test.ok(keywords.isKeyword(keyword));
    test.ok(!keywords.isKeyword(null));
    test.ok(!keywords.isKeyword(true));
    test.ok(!keywords.isKeyword(false));
    test.ok(!keywords.isKeyword(42));
    test.ok(!keywords.isKeyword('foo'));
};

exports['Equals'] = function (test) {
    var keyword = keywords.keyword('foo');
    var keyword2 = keywords.keyword('foo');
    var keyword3 = keywords.keyword('bar');
    
    test.ok(keyword.equals(keyword2));
    test.ok(keyword2.equals(keyword));
    test.ok(!keyword.equals(keyword3));
    test.ok(!keyword3.equals(keyword));
    
    test.ok(!keyword.equals(null));
    test.ok(!keyword.equals(42));
    test.ok(!keyword.equals("foo"));
    test.ok(!keyword.equals(":foo"));
};
