const { Trie } = require('../src/trie');
const { assert } = require('chai');
const { describe, it } = require('mocha');

describe("trie tests", function () {
    it('test insert', function () {
        let trie = new Trie();
        trie.insert("zoo");
        assert.deepEqual(trie.root, {
            'z': { 'o': { 'o': {} } }
        })
    })

    let trie = new Trie();
    trie.insert("china");
    trie.insert("japan");
    trie.insert("american");
    trie.insert("great");
    trie.insert("great");

    it('test find most', function () {
        assert.equal(trie.most(), "great");
    })
    it('test count times', function () {
        assert.equal(trie.count("great"), 2);
    })
    it('test count word have not appeared', function () {
        assert.equal(trie.count("again"), 0);
    })
})
