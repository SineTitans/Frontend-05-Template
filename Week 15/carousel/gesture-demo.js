import { enableGesture } from './gesture';
enableGesture(document.documentElement);
document.documentElement.addEventListener("tap", () => {
    console.log("tap event trigger!");
})