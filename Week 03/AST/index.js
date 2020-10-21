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

        if (lexRegExp.lastIndex - lastIndex > result[0].length) {
            // 清除正则表达式遗留内部状态，以防后续调用出错
            lexRegExp.lastIndex = 0;
            break;
        }

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

const AddNodeType = "AdditiveExpression";
const MulNodeType = "MultiplicativeExpression";

function deduceAdditiveExpression(current, next, tokens) {
    if (current.type == MulNodeType) {
        return deduceAdditiveExpression({
            type: AddNodeType,
            children: [current]
        }, next, tokens);
    }
    if (current.type == AddNodeType && next && next.type == "+") {
        let [mulExp, nextToken] = MultiplicativeExpression(tokens);
        return deduceAdditiveExpression({
            type: AddNodeType,
            operator: "+",
            children: [current, next, mulExp]
        }, nextToken, tokens);
    }
    if (current.type == AddNodeType && next && next.type == "-") {
        let [mulExp, nextToken] = MultiplicativeExpression(tokens);
        return deduceAdditiveExpression({
            type: AddNodeType,
            operator: "-",
            children: [current, next, mulExp]
        }, nextToken, tokens);
    }
    if (current.type == AddNodeType) {
        return [current, next];
    }
    let [
        mulExp, nextToken
    ] = deduceMultiplicativeExpression(current, next, tokens);
    return deduceAdditiveExpression(mulExp, nextToken, tokens);
}

function AdditiveExpression(tokens) {
    return deduceAdditiveExpression(
        getNext(tokens), getNext(tokens), tokens);
}

function deduceMultiplicativeExpression(current, next, tokens) {
    if (current.type == "Number") {
        return deduceMultiplicativeExpression({
            type: MulNodeType,
            children: [current]
        }, next, tokens);
    }
    if (current.type == MulNodeType && next && next.type == "*") {
        return deduceMultiplicativeExpression({
            type: MulNodeType,
            operator: "*",
            children: [current, next, getNext(tokens)]
        }, getNext(tokens), tokens);
    }
    if (current.type == MulNodeType && next && next.type == "/") {
        return deduceMultiplicativeExpression({
            type: MulNodeType,
            operator: "/",
            children: [current, next, getNext(tokens)]
        }, getNext(tokens), tokens);
    }
    if (current.type == MulNodeType) {
        return [current, next];
    }
    return deduceMultiplicativeExpression(next, getNext(tokens), tokens);
}

function MultiplicativeExpression(tokens) {
    return deduceMultiplicativeExpression(
        getNext(tokens), getNext(tokens), tokens);
}

module.exports = {
    tokenize,
    Expression,
    AdditiveExpression(tokens) {
        return AdditiveExpression(tokens)[0];
    },
    MultiplicativeExpression(tokens) {
        return MultiplicativeExpression(tokens)[0];
    },
};