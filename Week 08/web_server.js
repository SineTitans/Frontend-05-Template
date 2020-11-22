const http = require('http');

http.createServer(function (req, resp) {
    let body = [];

    req.on('error', err => console.error(err))
        .on('data', chunk => body.push(chunk))
        .on('end', function () {
            let reqData = Buffer.concat(body).toString();
            console.log("request body:", reqData);
            body = [];

            resp.writeHead(200, { 'Content-Type': 'text/html' });
            resp.end(' Hello World\n');
        });
}).listen(8088);

console.log("server started");