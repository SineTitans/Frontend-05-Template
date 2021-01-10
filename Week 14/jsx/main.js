import { createElement, Component, Fragment } from "./framework";

class Carousel extends Component {
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

        let currentIndex = 0;

        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;
            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = "none";

            next.style.transform = `translateX(${1 - nextIndex}00%)`;
            setTimeout(() => {
                next.style.transition = "";
                current.style.transform = `translateX(${-1 - currentIndex}00%)`;
                next.style.transform = `translateX(${-nextIndex}00%)`;
                currentIndex = nextIndex;
            }, 16);
        }, 3000);
        return this.root;
    }
}

let imgs = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

let a = <Carousel src={imgs} />;

a.mountTo(document.body);