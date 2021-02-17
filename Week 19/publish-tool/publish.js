let http = require('http');
let archiver = require('archiver');
let openPage = require('open');
let querystring = require('querystring');

openPage(`https://github.com/login/oauth/authorize?client_id=Iv1.5163197c99d4fd36`);

let closed = false;

let listenToken = http.createServer(function(req, resp) {
    console.log(req.url);
    if (closed) {
        resp.statusCode = 503;
        resp.end();
        listenToken.close();
    }
    let match = req.url.match(/^\/\?([\s\S]+)$/);
    if (match) {
        let info = querystring.parse(match[1]);
        console.log(info);
        listenToken.close();
        closed = true;
        resp.end();
        publish(info.token);
    }
}).listen(8083);

function publish(token) {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    archive.directory('./sample/', false);
    archive.finalize();

    let request = http.request({
        hostname: "172.30.167.94",
        // hostname: "127.0.0.1",
        path: `/publish?token=${token}`,
        port: 8082,
        method: "POST",
        headers: {
            'Content-Type': 'application/octet-stream',
        }
    }, resp => resp.pipe(process.stdout));

    archive.pipe(request);

    archive.on("finish", () => request.end());
}
