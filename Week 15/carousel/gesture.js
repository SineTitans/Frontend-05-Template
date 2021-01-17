let element = document.documentElement;
element.addEventListener("mousedown", event => {
    start(event);
    
    let mousemove = event => {
        move(event);
    };

    let mouseup = event => {
        end(event);
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
});

element.addEventListener("touchstart", event => {
    for (let touch of event.changedTouches) {
        start(touch);
    }
});

element.addEventListener("touchmove", event => {
    for (let touch of event.changedTouches) {
        move(touch);
    }
});

element.addEventListener("touchend", event => {
    for (let touch of event.changedTouches) {
        end(touch);
    }
});

element.addEventListener("touchcancel", event => {
    for (let touch of event.changedTouches) {
        cancel(touch);
    }
});

let handler;
let startX, startY;
let isTap = true, isPan = false, isPress = false;

let start = point => {
    startX = point.clientX, startY = point.clientY;

    isTap = true, isPan = false, isPress = false;

    handler = setTimeout(() => {
        isTap = false, isPan = false, isPress = true;
        handler = null;
        console.log("press");
    }, 500);
};

let move = point => {
    let dx = point.clientX - startX, dy = point.clientY - startY;
    if (!isPan && dx * dx + dy * dy > 100) {
        isTap = false, isPan = true, isPress = false;

        console.log("pan start");
        clearTimeout(handler);
    }

    if (isPan) {
        console.log(dx, dy);
        console.log("pan");
    }

    // console.log("move", point.clientX, point.clientY);
};

let end = point => {
    if (isTap) {
        console.log("tap");
        clearTimeout(handler);
    }
    if (isPan) {
        console.log("pan end");
    }
    if (isPress) {
        console.log("press end");
    }
    // console.log("end", point.clientX, point.clientY);
};

let cancel = point => {
    clearTimeout(handler);
    console.log("cancel", point.clientX, point.clientY);
};