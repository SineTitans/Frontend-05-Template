const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start time');

export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            let now = Date.now();
            for (let anime of this[ANIMATIONS]) {
                let t = now;
                if (this[START_TIME].get(anime) < startTime) {
                    t -= startTime;
                }
                else {
                    t -= this[START_TIME].get(anime);
                }
                if (anime.duration <= t) {
                    this[ANIMATIONS].delete(anime);
                    t = anime.duration;
                }
                anime.receiveTime(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        };
        this[TICK]();
    }
    pause() {

    }
    resume() {

    }
    reset() {

    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }
    receiveTime(time) {
        let range = this.endValue - this.startValue;
        this.object[this.property] = this.startValue + range * time / this.duration;
    }
}