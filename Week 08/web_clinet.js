const { Request } = require('./http_request');

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customized"
        },
        body: {
            name: "crescent"
        }
    });

    let resp = await request.send();

    console.log(resp);
}();
