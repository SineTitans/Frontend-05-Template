const match_1 = (() => {
    const start = ch => ch == 'a' ? match_a1 : start;
    const match_a1 = ch => ch == 'b' ? match_b1 : start(ch);
    const match_b1 = ch => ch == 'c' ? match_c : start(ch);
    const match_c = ch => ch == 'a' ? match_a2 : start(ch);
    const match_a2 = ch => ch == 'b' ? match_b2 : start(ch);
    const match_b2 = ch => ch == 'x' ? end : match_b1(ch);
    const end = () => end;

    function match(str = "", init = start, succ = end) {
        let state = init;
        for (let ch of str) {
            // console.log(ch, state.name);
            state = state(ch);
            // console.log('->', state.name);
        }
        return state == succ;
    }
    return match;
})();

console.log(`"aababcabcdabcabcabcabx" has "abcabx"? ${match_1("aababcabcdabcabcabcabx")}`);

const match_2 = (() => {
    const start = ch => ch == 'a' ? match_a1 : start;
    const match_a1 = ch => ch == 'b' ? match_b1 : start(ch);
    const match_b1 = ch => ch == 'a' ? match_a2 : start(ch);
    const match_a2 = ch => ch == 'b' ? match_b2 : start(ch);
    const match_b2 = ch => ch == 'a' ? match_a3 : match_b1(ch);
    const match_a3 = ch => ch == 'b' ? match_b3 : match_a2(ch);
    const match_b3 = ch => ch == 'x' ? end : match_b2(ch);
    const end = () => end;

    function match(str = "", init = start, succ = end) {
        let state = init;
        for (let ch of str) {
            // console.log(ch, state.name);
            state = state(ch);
            // console.log('->', state.name);
        }
        return state == succ;
    }
    return match;
})();

console.log(`"aababaababababaababababababx" has "abababx"? ${match_2("aababaababababaababababababx")}`);

function createKmpMatcher(pattern = "") {
    let chs = [...pattern];
    let end = () => end;
    let states = [
        ch => ch == chs[0] ? states[1] : states[0]
    ];
    let table = Array(chs.length).fill(0);
    for (let i = 1; i < chs.length; ++i) {
        states.push(ch => ch == chs[i] ?
            states[i + i] : states[0](ch));
    }
    states.push(end);

    let i = 1, j = 0;
    while (i < chs.length) {
        if (chs[i] == chs[j]) {
            ++i, ++j;
            if (table[i] != j) {
                table[i] = j;
                states[i] = ch => ch == chs[i] ?
                    states[i + i] : states[j](ch)
            }
        }
        else if (j > 0) {
            j = table[j];
        }
        else {
            ++i;
        }
    }
    table = null;
    return [states[0], end];
}


function match(str = "", init, succ) {
    let state = init;
    for (let ch of str) {
        state = state(ch);
    }
    return state == succ;
}

function kmpFindSubString(str = "", sub = "") {
    let matcher = createKmpMatcher(sub);
    return match(str, matcher[0], matcher[1]);
}

console.log(`"alphabets aababaababababaababababababx" has "abababx"? ${kmpFindSubString("alphabets aababaababababaababababababx", "abababx") >= 0}`);
