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

console.log(`"aababcabcdabcabcabcabx" has "abcabx"? ${match("aababcabcdabcabcabcabx")}`);