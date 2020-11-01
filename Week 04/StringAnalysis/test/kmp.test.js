const { assert } = require("chai");
const { describe } = require("mocha");
const { KMPMatcher, kmp } = require("../src/kmp");


describe("kmp tests", function () {
    it('test crate match table', function () {
        assert.deepEqual(
            new KMPMatcher("abcdabce").table,
            [0, 0, 0, 0, 0, 1, 2, 3]);
    })
    it('test match source string', function () {
        assert.equal(new KMPMatcher("ll").match("Hello"), 2);
    })
    it('test kmp match failed', function () {
        assert.equal(kmp("aabacabaaac", "aabaaac"), -1);
    })
    it('test kmp with prebuilt matcher', function () {
        assert.equal(kmp("abababc", new KMPMatcher("abababc")), 0);
    })
})