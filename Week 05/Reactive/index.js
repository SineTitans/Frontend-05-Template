import { start } from "repl";
import { reactive, effect } from "./toy-reactive.js";

let object = {
    a: {b: 3}, b: 2
}

let po = reactive(object);
effect(() => console.log(po.a.b));

let session = start();
session.context.po = po;