const EOF = Symbol("end of file");

function data(c) {
    if (c == '<') {
        return tagOpen;
    }
    if (c == EOF) {
        return;
    }
    return data;
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    }
    if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    }
    return;
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
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
        return selfClosingStartTag;
    }
    if (c.match(/^[a-zA-Z]$/)) {
        return tagName;
    }
    if (c == '>') {
        return data;
    }
    return tagName;
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    if (c == '>') {
        return data;
    }
    if (c == '=') {
        return beforeAttributeName;
    }
    return beforeAttributeName;
}

function selfClosingStartTag(c) {
    if (c == '>') {
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