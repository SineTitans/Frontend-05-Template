let lexRegExp = /([0-9]+(?:\.[0-9]*)?)|(\.[0-9]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
let dictionary = ["Number", "Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];

function* tokenize(source) {
    let result = null;
    let lastIndex = 0;
    while (true) {
        lastIndex = lexRegExp.lastIndex;
        result = lexRegExp.exec(source);

        if (!result)
            break;

        if (lexRegExp.lastIndex - lastIndex > result[0].length)
            break;

        let token = {
            type: null,
            value: null,
        }

        for (let i = 1; i <= dictionary.length; ++i) {
            if (result[i])
                token.type = dictionary[i - 1];
        }
        token.value = result[0];
        yield token;
    }
    yield {
        type: "EOF"
    }
}

module.exports = {
    tokenize,
};