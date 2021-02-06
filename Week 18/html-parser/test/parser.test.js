import assert from "assert";
import { describe, it } from "mocha";
import { parseHTML } from "../src/parser";

describe("parse html:", function () {
    it("<a>abc</a>", function () {
        let tree = parseHTML("<a>abc</a>");
        console.log(tree);
        assert.strictEqual(1, 1);
    })
});