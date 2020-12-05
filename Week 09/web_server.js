const http = require('http');

http.createServer(function (req, resp) {
    let body = [];

    req.on('error', err => console.error(err))
        .on('data', chunk => body.push(chunk))
        .on('end', function () {
            let reqData = Buffer.concat(body).toString();
            console.log("request path:", req.url);
            body = [];

            switch (req.url) {
                case '/':
                case '/week-08': {
                    resp.writeHead(200, { 'Content-Type': 'text/html' });
                    resp.end(' Hello World\n');
                } break;
                case '/week-09': {
                    resp.writeHead(200, { 'Content-Type': 'text/html' });
                    resp.end(`<!DOCTYPE html>

<html maaa=a>

<head>
    <meta charset="utf-8">
    <title>Hello world!</title>
    <style>
        body div #myid {
            width: 100px;
            background-color: #ff5000;
        }

        body div img {
            width: 30px;
            background-color: #ff1111;
        }
    </style>
</head>

<body>
    <div>
        <img id="myid" />
        <img />
    </div>
</body>

</html>
`);
                } break;
                default: {
                    resp.writeHead(404, { 'Content-Type': 'text/html' });
                    resp.end();
                } break;
            }
        });
}).listen(8088);

console.log("server started");