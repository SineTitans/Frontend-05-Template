const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick handler');
const ANIMATIONS = Symbol('animations');

export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
    }
    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            let t = Date.now() - startTime;
            for (let anime of this[ANIMATIONS]) {
                if (anime.duration <= t) {
                    this[ANIMATIONS].delete(anime);
                    anime.receiveTime(anime.duration);
                }
                else {
                    anime.receiveTime(t);
                }
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
    add(animation) {
        this[ANIMATIONS].add(animation);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, timingFunction) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }
    receiveTime(time) {
        let range = this.endValue - this.startValue;
        this.object[this.property] = this.startValue + range * time / this.duration;
    }
}