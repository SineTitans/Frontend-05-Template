import { Component } from './framework';
import { enableGesture } from './gesture';
import { Animation, Timeline } from './animation';
import { ease } from './ease';

export class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add('carousel');
        for (let record of this.attributes.src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url(${record})`;
            this.root.appendChild(child);
        }
        enableGesture(this.root);
        let timeline = new Timeline;
        timeline.start();

        let handler = null;

        let children = this.root.children;
        let position = 0;

        let t = 0;
        let ax = 0;
        
        this.root.addEventListener("start", event => {
            timeline.pause();
            clearInterval(handler);
            handler = null;
            let dt = Date.now() - t;
            if (dt < 500) {
                let progress = dt / 500;
                ax = ease(progress) * 500 - 500;
            }
            else {
                ax = 0;
            }
        });
        this.root.addEventListener("pan", event => {
            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500) / 500);
            for (let offset of [1, 0, -1]) {
                let pos = (current + offset) % children.length;
                pos = (pos + children.length) % children.length;
                let child = children[pos];
                child.style.transition = "none";
                child.style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
            }
        });
        this.root.addEventListener("end", event => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);

            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);

            if (event.isFlick) {
                if (event.velocity > 0) {
                    direction = Math.floor((x % 500) / 500);
                }
                else {
                    direction = Math.ceil((x % 500) / 500);
                }
            }

            for (let offset of [1, 0, -1]) {
                let pos = (current + offset) % children.length;
                pos = (pos + children.length) % children.length;
                let child = children[pos];
                child.style.transition = "none";
                timeline.add(new Animation(child.style, "transform",
                    -pos * 500 + offset * 500 + x % 500,
                    -pos * 500 + offset * 500 + direction * 500,
                    500, 0, ease, v => `translateX(${v}px)`));
            }
            position = (position - ((x - x % 500) / 500) - direction) % children.length;
            position = (position + children.length) % children.length;
        });

        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (position + 1) % children.length;
            let current = children[position];
            let next = children[nextIndex];

            t = Date.now();

            timeline.add(new Animation(current.style, "transform", -position * 500, -500 - position * 500, 500, 0, ease, v => `translateX(${v}px)`));
            timeline.add(new Animation(next.style, "transform", 500 - nextIndex * 500, -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`));

            position = nextIndex;
        }

        handler = setInterval(nextPicture, 3000);

        return this.root;
    }
}