const repl = require("repl");

let object = {
    a: 1, b: 2
}

function reactive(object) {
    return new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val;
            console.log(obj, prop, val);
            return obj[prop];
        },
        get(obj, prop) {
            console.log(obj, prop);
            return obj[prop];
        }
    })
}

let po = reactive(object);

let session = repl.start();
session.context.po = po;