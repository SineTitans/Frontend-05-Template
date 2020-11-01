class KMPMatcher {
    constructor(pattern) {
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

    match(source) {
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

function kmp(source, pattern) {
    let matcher = pattern instanceof KMPMatcher ?
        pattern : new KMPMatcher(pattern);

    return matcher.match(source); 
}

module.exports = {
    default: kmp,
    kmp,
    KMPMatcher,
}