import assert from "assert";
import { describe, it } from "mocha";
import { parseHTML } from "../src/parser";

describe("parse html:", function () {
    it("<a></a>", function () {
        let tree = parseHTML("<a></a>");
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    it(`<a href="//time.geekbang.org"></a>`, function () {
        let tree = parseHTML('<a href="//time.geekbang.org"></a>');
        console.log(tree);
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    });
});