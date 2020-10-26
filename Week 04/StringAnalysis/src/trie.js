let $ = Symbol('End Of Word');

class Trie {
    constructor() {
        this.root = Object.create(null);
    }
    insert(word) {
        let node = this.root;
        for (let c of word) {
            if (!node[c])
                node[c] = Object.create(null);
            node = node[c];
        }
        if (!($ in node))
            node[$] = 0;
        
        node[$]++;
    }
    most() {
        let max = 0;
        let maxWord = null;
        let visit = (node, word) => {
            if (node[$] && node[$] > max) {
                max = node[$];
                maxWord = word;
            }
            for (let c in node) {
                visit(node[c], word + c);
            }
        };

        visit(this.root, "");
        return maxWord;
    }
    count(word) {
        let node = this.root;
        for (let c of word) {
            if (!node[c]) return 0;
            node = node[c];
        }
        return node[$] || 0;
    }
}

module.exports = {
    default: Trie,
    Trie: Trie,
};
