const repl = require("repl");

let object = {
    a: 1, b: 2
}

let po = new Proxy(object, {
    set(obj, prop, val) {
        console.log(obj, prop, val);
    }
})

let session = repl.start();
session.context.po = po;