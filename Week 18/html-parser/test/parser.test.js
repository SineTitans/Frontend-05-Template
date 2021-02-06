import assert from "assert";
import { describe, it } from "mocha";
import { parseHTML } from "../src/parser";

describe("parse html:", function () {
    it("<a></a>", function () {
        let tree = parseHTML("<a></a>");
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href="//time.geekbang.org"></a>', function () {
        let tree = parseHTML('<a href="//time.geekbang.org"></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href id></a>', function () {
        let tree = parseHTML('<a href id></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a href="www.baidu.com" id></a>', function () {
        let tree = parseHTML('<a href="www.baidu.com" id></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a id=abc ></a>', function () {
        let tree = parseHTML('<a id=abc ></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a id=abc></a>', function () {
        let tree = parseHTML('<a id=abc></a>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it('<a id=abc/>', function () {
        let tree = parseHTML('<a id=abc/>');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it("<a id='abc'/>", function () {
        let tree = parseHTML("<a id='abc'/>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it("<a />", function () {
        let tree = parseHTML("<a />");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it("<a/>", function () {
        let tree = parseHTML("<a/>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it("<A /> upper case", function () {
        let tree = parseHTML("<A />");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it("<>", function () {
        let tree = parseHTML("<>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, 'text');
    });
    it("<meta >", function () {
        let tree = parseHTML("<meta >");
        assert.strictEqual(tree.children.length, 0);
    });
    it("<a></div>", function () {
        assert.throws(() => parseHTML("<a></div>"));
    });
    it("text", function () {
        let tree = parseHTML("text");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, 'text');
    });
});