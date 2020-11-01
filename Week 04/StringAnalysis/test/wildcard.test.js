const { assert } = require("chai");
const { describe } = require("mocha");
const { wildcardMatch } = require("../src/wildcard");

describe("wildcard match tests", function () {
    it('test match starts', function () {
        assert.equal(wildcardMatch("abcabcabxaac", "a*b*bx*c"), true);
    })
    it('test match without star', function () {
        assert.equal(wildcardMatch("abcdef", "abc?ef"), true);
        assert.equal(wildcardMatch("abided", "abc?ef"), false);
        assert.equal(wildcardMatch("abiders", "abi?er"), false);
    })
    it('test match failed', function () {
        assert.equal(wildcardMatch("cbcabcabxaac", "a*b*bx*c"), false);
        assert.equal(wildcardMatch("abcabcaxaac", "a*b*bx*c"), false);
        assert.equal(wildcardMatch("abcabcabxaad", "a*b*bx*c"), false);
    })
})