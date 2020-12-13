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
                    resp.end(`
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
                case '/week-10': {
                    resp.writeHead(200, { 'Content-Type': 'text/html' });
                    resp.end(`
<style>
    #par {
        align-items: center;
        display: flex;
        width: 500px;
        justify-content: space-around;
        background-color: rgb(255,255,255);
    }
    #c1 {
        flex: 1;
        width: 100px;
        height: 70px;
        background-color: rgb(255,0,0);
    }
    #c2 {
        width: 200px;
        height: 50px;
        background-color: rgb(0,255,0);
    }
    #c3 {
        width:200px;
        height:100px;
        background-color: rgb(0,0,255);
    }
</style>
<div id="par">
    <div id="c1"></div>
    <div id="c2"></div>
    <div id="c3"></div>
</div>
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