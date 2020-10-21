const { describe, it } = require('mocha');
const { assert } = require('chai');
const {
    tokenize,
    MultiplicativeExpression,
} = require('./index');

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
    it('test multiplication', function () {
        let tokens = tokenize("10 * 25 / 2");
        let ast = MultiplicativeExpression(tokens);
        assert.equal(ast.operator, '/');
        assert.equal(ast.children[2].value, '2');
        assert.equal(ast.children[1].value, '/');
        ast = ast.children[0];
        assert.equal(ast.operator, '*');
        assert.equal(ast.children[2].value, '25');
        assert.equal(ast.children[1].value, '*');
        ast = ast.children[0];
        assert.equal(ast.children[0].value, '10');
    })
    it("test invalid expression", function () {
        let test_tokens = [...tokenize("*25...14")];
        assert.equal(test_tokens[2].type, "EOF");
        let tokens = tokenize("*25...14");
        let ast = MultiplicativeExpression(tokens);
        assert.equal(ast.children[0].value, '25.');
    })
})