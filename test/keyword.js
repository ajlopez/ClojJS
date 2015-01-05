
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

