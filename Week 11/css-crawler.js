const { standards } = require('./standards');

let iframe = document.createElement('iframe');
document.body.innerHTML = "";
document.body.appendChild(iframe);

function happen(element, event) {
    return new Promise(resolve => {
        function handler() {
            resolve();
            element.removeEventListener(event, handler);
        }
        element.addEventListener(event, handler);
    })
}

void async function () {
    for (let standard of standards) {
        iframe.src = standard.url;
        console.log(standard.name);
        await happen(iframe, 'load');
        console.log(iframe.contentDocument.querySelectorAll(".propdef"));
    }
}();