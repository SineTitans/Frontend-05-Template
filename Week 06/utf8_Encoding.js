/** @param {string} string */
function UTF8_Encoding(string) {
    const maxHeads = [0x80, 0x20, 0x10, 0x8];
    const headBits = [0, 0xc0, 0xe0, 0xf0]
    /** @param {string} str */
    function *str2u8(str) {
        for (let ch of str) {
            let code = ch.codePointAt(0);
            if (code < maxHeads[0]) {
                yield code;
                continue;
            }
            /** @type {number[]} */
            let bytes = [];
            while (code > 0x40) {
                let tail = code & 0x3f;
                bytes.push(tail | 0x80);
                code >>= 6;
            }
            if (code < maxHeads[bytes.length]) {
                yield headBits[bytes.length] | code;
            }
            else {
                bytes.push(code | 0x80);
                yield headBits[bytes.length];
            }
            while (bytes.length) {
                yield bytes.pop();
            }
        }
    }

    return Uint8Array.from(str2u8(string)).buffer;
}

console.log(UTF8_Encoding("一"));