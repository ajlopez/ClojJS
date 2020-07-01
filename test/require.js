
const clojjs = require('..');

exports['Require namespace'] = function (test) {
    if (typeof user != 'undefined' && typeof user.core != 'undefined')
        delete user.core;
        
    clojjs.setSource('test/src');
    clojjs.requireNamespace('user.core', {});
    
    test.ok(user);
    test.ok(user.core);
    test.ok(user.core.one);
    test.equal(user.core.one, 1);
}

exports['Cannot resolve namespace'] = function (test) {
    if (typeof user != 'undefined' && typeof user.core != 'undefined')
        delete user.core;
        
    clojjs.setSource('test/files');
    
    test.throws(
        function() {
            clojjs.requireNamespace('user.core2', {});
        },
        {
            message: "Cannot resolve namespace 'user.core2'"
        }
    );
}

exports['Require namespace once'] = function (test) {
    if (typeof user != 'undefined' && typeof user.core != 'undefined')
        delete user.core;
        
    clojjs.setSource('test/src');
    clojjs.requireNamespace('user.core', {}, true);
    
    test.ok(user);
    test.ok(user.core);
    test.ok(user.core.one);
    test.equal(user.core.one, 1);
    
    user.core.one = 2;

    clojjs.requireNamespace('user.core', {});
    
    test.ok(user);
    test.ok(user.core);
    test.ok(user.core.one);
    test.equal(user.core.one, 2);
}
