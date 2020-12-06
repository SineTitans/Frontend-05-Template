const EOF = Symbol("end of file");

let currentToken = null;
let currentAttribute = null;

function emit(token) {
    console.log(token);
}

function data(c) {
    if (c == '<') {
        return tagOpen;
    }
    if (c == EOF) {
        emit({ type: "EOF" });
        return;
    }
    emit({
        type: "text",
        content: c,
    })
    return data;
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    }
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: "",
        }
        return tagName(c);
    }
    return;
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: "",
        }
        return tagName(c);
    }
    if (c == '>') {
        return;
    }
    if (c == EOF) {
        return;
    }
    return;
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    if (c == '/') {
        currentToken.selfClosingStartTag = true;
        return selfClosingStartTag;
    }
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    }
    if (c == '>') {
        emit(currentToken);
        return data;
    }
    return tagName;
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    if (c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    }
    if (c == '=') {
        return;
    }
    currentAttribute = {
        name: "", value: "",
    };
    return attributeName(c);
}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    }
    if (c == '=') {
        return beforeAttributeValue;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == '\"' || c == "'" || c == '<') {
        return;
    }
    currentAttribute.name += c;
    return attributeName;
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == EOF) {
        return beforeAttributeValue;
    }
    if (c == '"') {
        return doubleQuotedAttributeValue;
    }
    if (c == "'") {
        return singleQuotedAttributeValue;
    }
    if (c == '>') {
        return;
    }
    return UnquotedAttributeValue(c);
}

function doubleQuotedAttributeValue(c) {
    if (c == '"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == EOF) {
        return;
    }
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
}

function singleQuotedAttributeValue(c) {
    if (c == "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == EOF) {
        return;
    }
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }
    if (c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentToken.selfClosingStartTag = true;
        return selfClosingStartTag;
    }
    if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }
    if (c == '\u0000') {
        return;
    }
    if (c == '"' || c == "'" || c == '<' || c == '=' || c == '`') {
        return;
    }
    if (c == EOF) {
        return;
    }
    currentAttribute.value += c;
    return UnquotedAttributeValue;
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    if (c == '/') {
        currentToken.selfClosingStartTag = true;
        return selfClosingStartTag;
    }
    if (c == '>') {
        emit(currentToken);
        return data;
    }
    if (c == EOF) {
        return;
    }
    return;
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    }
    if (c == '/') {
        currentToken.selfClosingStartTag = true;
        return selfClosingStartTag;
    }
    if (c == '=') {
        return beforeAttributeValue;
    }
    if (c == '>') {
        emit(currentToken);
        return data;
    }
    if (c == EOF) {
        return;
    }
    currentAttribute = {
        name: "", value: "",
    };
    return attributeName(c);
}

function selfClosingStartTag(c) {
    if (c == '>') {
        emit(currentToken);
        return data;
    }
    if (c == EOF) {
        return;
    }
    return;
}

function parseHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
}

module.exports = {
    parseHTML,
}