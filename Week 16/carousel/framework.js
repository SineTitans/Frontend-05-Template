export function createElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    }
    else {
        element = new type;
    }
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    let processChildren = children => {
        for (let child of children) {
            if (typeof child == 'object' && child instanceof Array) {
                processChildren(child);
                continue;
            }
            if (typeof child === "string") {
                child = new TextWrapper(child);
            }
            element.appendChild(child);
        }
    }
    processChildren(children);
    return element;
}

export const STATE = Symbol('state');
export const ATTRIBUTE = Symbol('attribute');

export class Component {
    constructor() {
        this[ATTRIBUTE] = Object.create(null);
        this[STATE] = Object.create(null);
    }
    render() {
        return this.root;
    }
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value;
    }
    appendChild(child) {
        if (!this.root) {
            this.render();
        }
        child.mountTo(this.root);
    }
    mountTo(parent) {
        if (!this.root) {
            this.render();
        }
        parent.appendChild(this.root);
    }
    triggerEvent(type, args) {
        type = type.replace(/^[\s\S]/, s => s.toUpperCase());
        let callback = this[ATTRIBUTE][`on${type}`];
        if (callback) {
            callback.call(this, new CustomEvent(type, { detail: args }));
        }
    }
}

class ElementWrapper extends Component {
    constructor(type = "") {
        super();
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
}

class TextWrapper extends Component {
    constructor(content = "") {
        super();
        this.root = document.createTextNode(content);
    }
}

export class Fragment extends Component {
    constructor() {
        super();
        this.root = document.createDocumentFragment();
    }
}