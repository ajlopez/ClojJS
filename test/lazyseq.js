
const lazyseqs = require('../lib/lazyseq');
const lists = require('../lib/list');

exports['create and consume lazy seq'] = function (test) {
    let n = 1;
    
    const fn = function () {
        return lists.list(n++, lazyseqs.create(fn));
    }
    
    const lseq = lazyseqs.create(fn);
    
    test.ok(lseq);
    
    test.equal(lseq.first(), 1);
    test.equal(lseq.first(), 1);
    test.ok(lseq.next());
    test.equal(lseq.next().first(), 2);
    test.equal(lseq.next().first(), 2);
    test.ok(lseq.next());
    test.equal(lseq.next().next().first(), 3);
    test.equal(lseq.next().next().first(), 3);
}

exports['create empty lazy seq'] = function (test) {
    test.ok(lists.isEmptyList(lazyseqs.create(null)));
}
