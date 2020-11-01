const { kmp } = require('./src/kmp');
const { Trie } = require('./src/trie');
const { wildcardMatch } = require('./src/wildcard');

function randomWord(length) {
    const baseCh = "a".charCodeAt(0);
    return Array(length).fill(0)
        .map(() => Math.random())
        .map(c => c * 26 + baseCh)
        .map(c => String.fromCharCode(c))
        .join("");
}

let trie = new Trie();

for (let i = 0; i < 100000; ++i) {
    trie.insert(randomWord(4));
}

let mostWord = trie.most();
console.log(`most comes up word is ${mostWord}, it comes up ${trie.count(mostWord)} time(s).`);

console.log(kmp("Hello", "ll"));
console.log(kmp("abcdabcdabcex", "abcdabce"));
console.log(kmp("abababc", "abababc"));
console.log(kmp("aabaaabaaac", "aabaaac"));

console.log(wildcardMatch("abcabcabxaac", "a*b*bx*c"));