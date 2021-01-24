import { createElement, Component, STATE, ATTRIBUTE } from './framework';
export { STATE, ATTRIBUTE } from './framework';
import { enableGesture } from './gesture';

export class List extends Component {
    render() {
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{this.children}</div>).render();
        return this.root;
    }

    appendChild(child) {
        this.template = child;
        this.render();
    }
}