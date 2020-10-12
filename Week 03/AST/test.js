const { describe, it } = require('mocha');
const { assert } = require('chai');
const { tokenize } = require('./index');

describe("test ast ll(1)", function () {
    it("test tokenize", function () {
        let tokens = [...tokenize("1024 + 10 * 25")];
        assert.deepEqual(tokens, [
            { type: 'Number', value: '1024' },
            { type: 'Whitespace', value: ' ' },
            { type: '+', value: '+' },
            { type: 'Whitespace', value: ' ' },
            { type: 'Number', value: '10' },
            { type: 'Whitespace', value: ' ' },
            { type: '*', value: '*' },
            { type: 'Whitespace', value: ' ' },
            { type: 'Number', value: '25' },
            { type: 'EOF' },
        ]);
    })
    it("test invalid expression", function () {
        let tokens = [...tokenize("25...14")];
        assert.deepEqual(tokens, [
            { type: "Number", value: "25." },
            { type: "EOF" },
        ]);
    })
})