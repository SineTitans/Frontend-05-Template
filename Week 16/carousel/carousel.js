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

        let children = this.root.children;
        let position = 0;
        
        this.root.addEventListener("pan", event => {
            console.log(event.clientX);
        });

        // this.root.addEventListener("mousedown", event => {
        //     let children = this.root.children;
        //     let startX = event.clientX;

        //     let move = event => {
        //         let x = event.clientX - startX;
        //         let current = position - ((x - x % 500) / 500);

        //         for (let offset of [1, 0, -1]) {
        //             let pos = current + offset;
        //             pos = (pos + children.length) % children.length;
        //             let child = children[pos];
        //             child.style.transition = "none";
        //             child.style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
        //         }
        //     };

        //     let up = event => {
        //         let x = event.clientX - startX;
        //         position = (position % children.length) + children.length - Math.round(x / 500);
        //         for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
        //             let pos = position + offset;
        //             pos = (pos + children.length) % children.length;
        //             let child = children[pos];
        //             child.style.transition = "";
        //             child.style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        //         }
        //         document.removeEventListener("mousemove", move);
        //         document.removeEventListener("mouseup", up);
        //     };

        //     document.addEventListener("mousemove", move);
        //     document.addEventListener("mouseup", up);
        // });

        // let currentIndex = 0;

        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length;
        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     next.style.transition = "none";

        //     next.style.transform = `translateX(${1 - nextIndex}00%)`;
        //     setTimeout(() => {
        //         next.style.transition = "";
        //         current.style.transform = `translateX(${-1 - currentIndex}00%)`;
        //         next.style.transform = `translateX(${-nextIndex}00%)`;
        //         currentIndex = nextIndex;
        //     }, 16);
        // }, 3000);
        return this.root;
    }
}