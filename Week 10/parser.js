const css = require('css');
const { layout } = require('./layout');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [];
let rules = [];

function addCSSRules(text) {
    let ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
    if (!selector || !element.attributes)
        return false;

    if (selector.charAt(0) == '#') {
        let attr = element.attributes.filter(attr => attr.name === "id")[0];
        if (attr && attr.value === selector.replace("#", ''))
            return true;
    }
    else if (selector.charAt(0) == '.') {
        let attr = element.attributes.filter(attr => attr.name === "class")[0];
        let aimCls = selector.replace(".", '');
        if (attr && attr.value.split(' ').some(cls => cls === aimCls))
            return true;
    }
    else if (element.tagName === selector) {
        return true;
    }
    return false;
}

function specificity(selector) {
    let result = { inline: 0, id: 0, class: 0, tag: 0 };
    for (let part of selector.split(' ')) {
        let lead = part.charAt(0);
        if (lead == '#') ++result.id;
        else if (lead == '.') ++result.class;
        else ++result.tag;
    }
    return result;
}

function compare(sp1, sp2) {
    return sp1.inline != sp2.inline ? sp1.inline - sp2.inline :
        sp1.id != sp2.id ? sp1.id - sp2.id :
            sp1.class != sp2.class ? sp1.class - sp2.class :
                sp1.tag - sp2.tag;
}

function computeCSS(element) {
    let elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectorParts[0]))
            continue;

        let matched = false;

        let j = 1;
        for (let i = 0; i < elements.length; ++i) {
            if (match(elements[i], selectorParts[j])) {
                ++j;
            }
        }
        if (j >= selectorParts.length)
            matched = true;

        if (matched) {
            let sp = specificity(rule.selectors[0])
            let computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {};

                let property = computedStyle[declaration.property];
                if (!property.specificity) {
                    property.value = declaration.value;
                    property.specificity = sp;
                }
                else if (compare(property.specificity, sp) < 0) {
                    property.value = declaration.value;
                    property.specificity = sp;
                }

            }
        }
    }
}

function emit(token) {
    let top = stack[stack.length - 1];

    if (token.type == 'startTag') {
        let element = {
            type: "element",
            children: [],
            attributes: [],
        };

        element.tagName = token.tagName;
        delete token.type;
        delete token.tagName;

        let needPush = false;
        if (!token.isSelfClosing) {
            needPush = true;
        }
        else {
            delete token.isSelfClosing;
        }

        for (let p in token) {
            element.attributes.push({
                name: p, value: token[p],
            });
        }

        computeCSS(element);

        top.children.push(element);
        element.parent = top;
        
        if (needPush) stack.push(element);

        currentTextNode = null;
    }
    else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        }
        else {
            if (top.tagName == "style") {
                addCSSRules(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }

        currentTextNode = null;
    }
    else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: "",
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol("end of file");

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
        if (currentToken.tagName == "meta") {
            currentToken.type = "meta";
            delete currentToken.tagName;
        }
        return beforeAttributeName;
    }
    if (c == '/') {
        currentToken.isSelfClosing = true;
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
        currentToken.isSelfClosing = true;
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
        currentToken.isSelfClosing = true;
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
        currentToken.isSelfClosing = true;
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
    stack = [
        { type: 'document', children: [] },
    ];

    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    let dom = stack[0];
    return dom;
}

module.exports = {
    parseHTML,
}