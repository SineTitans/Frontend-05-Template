import { createElement, Component, STATE, ATTRIBUTE } from './framework';
export { STATE, ATTRIBUTE } from './framework';
import { enableGesture } from './gesture';

export class Button extends Component {
    render() {
        this.childContainer = <span />;
        this.root = (<div>{this.childContainer}</div>).render();
        return this.root;
    }

    appendChild(child) {
        if (!this.childContainer) {
            this.render();
        }
        this.childContainer.appendChild(child);
    }
}