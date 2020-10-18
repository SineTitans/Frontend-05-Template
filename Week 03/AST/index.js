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

function getNext(tokens) {
    let next = tokens.next();
    while (next) {
        let value = next.value;
        if (value.type != "Whitespace" && value.type != "LineTerminator") return value;
        next = tokens.next();
    }
}

function deduceExpression(current, tokens) {

}

function Expression(tokens) {

}

function deduceAdditiveExpression(current, tokens) {

}

function AdditiveExpression(tokens) {

}

function deduceMultiplicativeExpression(current, tokens) {
    const MulNodeType = "MultiplicativeExpression";
    if (current.type == "Number") {
        return deduceMultiplicativeExpression({
            type: MulNodeType,
            children: [current]
        }, tokens);
    }
    let next = getNext(tokens);
    if (current.type == MulNodeType && next && next.type == "*") {
        return deduceMultiplicativeExpression({
            type: MulNodeType,
            operator: "*",
            children: [current, next, getNext(tokens)]
        }, tokens);
    }
    if (current.type == MulNodeType && next && next.type == "/") {
        return deduceMultiplicativeExpression({
            type: MulNodeType,
            operator: "/",
            children: [current, next, getNext(tokens)]
        }, tokens);
    }
    if (current.type == MulNodeType) {
        return current;
    }
    return deduceMultiplicativeExpression(next, tokens);
}

function MultiplicativeExpression(tokens) {
    return deduceMultiplicativeExpression(getNext(tokens), tokens);
}

module.exports = {
    tokenize,
    Expression,
    AdditiveExpression,
    MultiplicativeExpression,
};