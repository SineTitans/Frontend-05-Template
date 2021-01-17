let element = document.documentElement;

let contexts = new Map;

let isListeningMouse = false;

element.addEventListener("mousedown", event => {
    let context = Object.create(null);
    contexts.set(`mouse ${1 << event.button}`, context);

    start(event, context);
    
    let mousemove = event => {
        let button = 1;
        while (button <= event.buttons) {
            if (button & event.buttons) {
                let key;
                if (button === 2) {
                    key = 4;
                }
                else if (button === 4) {
                    key = 2;
                }
                else {
                    key = button;
                }
                let context = contexts.get(`mouse ${key}`);
                move(event, context);
            }
            button <<= 1;
        }
    };

    let mouseup = event => {
        let mouseKey = `mouse ${1 << event.button}`;
        let context = contexts.get(mouseKey);
        end(event, context);
        contexts.delete(mouseKey);
        if (event.buttons === 0) {
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
            isListeningMouse = false;
        }
    };

    if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        isListeningMouse = true;
    }
});

element.addEventListener("touchstart", event => {
    for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    }
});

element.addEventListener("touchmove", event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        move(touch, context);
    }
});

element.addEventListener("touchend", event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }
});

element.addEventListener("touchcancel", event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }
});

let handler;
let startX, startY;
let isTap = true, isPan = false, isPress = false;

let start = (point, context) => {
    context.startX = point.clientX, context.startY = point.clientY;
    context.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
    }];

    context.isTap = true, context.isPan = false, context.isPress = false;

    context.handler = setTimeout(() => {
        context.isTap = false, context.isPan = false, context.isPress = true;
        context.handler = null;
        console.log("press");
    }, 500);
};

let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (!context.isPan && dx * dx + dy * dy > 100) {
        context.isTap = false, context.isPan = true, context.isPress = false;

        console.log("pan start");
        clearTimeout(context.handler);
    }

    if (context.isPan) {
        console.log(dx, dy);
        console.log("pan");
    }

    context.points = context.points.filter(p => Date.now() - p.t < 500);

    context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
    });
};

let end = (point, context) => {
    if (context.isTap) {
        dispatch("tap", {});
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log("pan end");
    }
    if (context.isPress) {
        console.log("press end");
    }

    context.points = context.points.filter(p => Date.now() - p.t < 500);

    if (context.points.length > 0) {
        let dx = point.clientX - context.points[0].x;
        let dy = point.clientY - context.points[0].y;
        let dis = Math.sqrt(dx * dx + dy * dy);
        let v = dis / (Date.now() - context.points[0].t);
        if (v > 1.5) {
            console.log("flick");
        }
    }
};

let cancel = (point, context) => {
    clearTimeout(context.handler);
    console.log("cancel", point.clientX, point.clientY);
};

function dispatch(type, properties) {
    let event = new Event(type)
    for (let name in properties) {
        event[name] = properties[name];
    }
    element.dispatchEvent(event);
}
