const images = require('images');
const { Request } = require('../Week 08/http_request');
const { parseHTML } = require('./parser');
const { render } = require('./render');

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/week-10",
        headers: {
            ["X-Foo2"]: "customized"
        },
        body: {
            name: "crescent"
        }
    });

    let resp = await request.send();

    let dom = parseHTML(resp.body);

    let viewport = images(800, 600);

    render(viewport, dom);

    viewport.save("viewport.jpg");
}();