let http = require('http');
let https = require('https');
let unzipper = require('unzipper');
let querystring = require('querystring');

function getToken(code, callback) {
    let request = https.request({
        hostname: "github.com",
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.5163197c99d4fd36&client_secret=1ae2591e2dae0890fc68ef5854bcf7c5d06a7c84`,
        port: 443,
        method: "POST",
    }, function (resp) {
        let receiving = "";
        resp.on('data', function (chunk) {
            receiving += chunk.toString();
        });
        resp.on('end', function () {
            callback(querystring.parse(receiving));
        });
    });
    request.end();
}

function auth(req, resp) {
    let query = req.url.match(/^\/auth\?([\s\S]+)$/)[1];
    let info = querystring.parse(query);
    getToken(info.code, function (auth) {
        console.log("got token", auth.access_token);
        resp.write(JSON.stringify(auth));
        resp.end()
    });
}

function publish(req, resp) {
    req.pipe(unzipper.Extract({ path: "../server/public/" }));
    req.on('end', () => resp.end("Success"));
}

http.createServer(function(req, resp) {
    console.log("req url:", req.url);
    console.log("req headers:", req.headers);
    if (req.url.match(/^\/auth\?/)) {
        return auth(req, resp);
    }
    else if (req.url.match(/^\/publish\?/)) {
        return publish(req, resp);
    }
    else {
        resp.statusCode = 404;
        resp.end();
    }
}).listen(8082);
