let callbacks = [];

function effect(callback) {
    callbacks.push(callback);
} 

function reactive(object) {
    return new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val;
            for (let callback of callbacks) {
                callback();
            }
            return obj[prop];
        },
        get(obj, prop) {
            console.log(obj, prop);
            return obj[prop];
        }
    })
}

let object = {
    a: 1, b: 2
}

let po = reactive(object);
effect(() => console.log(po.a));

const repl = require("repl");
let session = repl.start();
session.context.po = po;