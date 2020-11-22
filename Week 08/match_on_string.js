function find_Ch_a(str = "") {
    return str.indexOf('a');
}

console.log(`"A great world" has "a"? ${find_Ch_a("A great world") >= 0}`);

function findSubString(str = "", sub = "") {
    return str.indexOf(sub);
}

console.log(`"abandon" has "ab"? ${findSubString("abandon", "ab") >= 0}`);

class KMPMatcher {
    constructor(pattern = "") {
        this.pattern = pattern;
        this.table = new Array(pattern.length).fill(0);

        let i = 1, j = 0;
        while (i < pattern.length) {
            if (pattern[i] == pattern[j]) {
                ++i, ++j;
                this.table[i] = j;
            }
            else if (j > 0) {
                j = this.table[j];
            }
            else {
                ++i;
            }
        }
    }

    match(source = "") {
        let i = 0, j = 0;
        while (true) {
            if (j == this.pattern.length) {
                return i - j;
            }
            if (i >= source.length) break;
            if (this.pattern[j] == source[i]) {
                ++i, ++j;
            }
            else if (j > 0) {
                j = this.table[j];
            }
            else {
                ++i;
            }
        }
        return -1;  
    }
}

function kmpFindSubString(str = "", sub = "") {
    let matcher = new KMPMatcher(sub);
    return matcher.match(str);
}

console.log(`"alphabets abcdefg" has "abcdef"? ${kmpFindSubString("alphabets abcdefg", "abcdef") >= 0}`);
