let callbacks = new Map();

let usedReactivities = [];

let reactivities = new Map();

function effect(callback) {
    usedReactivities = [];
    callback();
    console.log(usedReactivities);

    for (let reactivity of usedReactivities) {
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map());
        }
        let callbackMap = callbacks.get(reactivity[0]);
        if (!callbackMap.has(reactivity[1])) {
            callbackMap.set(reactivity[1], new Set());
        }
        let callbackList = callbackMap.get(reactivity[1]);
        callbackList.add(callback);
    }
} 

function reactive(object) {
    if (reactivities.has(object)) {
        return reactivities.get(object);
    }

    let result = new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val;
            if (callbacks.has(obj)) {
                let callbackMap = callbacks.get(obj);
                if (callbackMap.has(prop)) {
                    let callbackList = callbackMap.get(prop);
                    for (let callback of callbackList) {
                        callback();
                    }
                }
            }
            return obj[prop];
        },
        get(obj, prop) {
            usedReactivities.push([obj, prop]);
            if (typeof obj[prop] === "object") {
                return reactive(obj[prop]);
            }

            return obj[prop];
        }
    })

    reactivities.set(object, result);
    return result;
}

let object = {
    a: {b: 3}, b: 2
}

let po = reactive(object);
effect(() => console.log(po.a.b));

const repl = require("repl");
let session = repl.start();
session.context.po = po;