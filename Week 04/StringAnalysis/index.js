const { Trie } = require('./src/trie');

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