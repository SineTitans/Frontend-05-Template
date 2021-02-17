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
        resp.write(`<a href="http://localhost:8083/?token=${auth.access_token}">publish</a>`);
        resp.end()
    });
}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.github.com",
        path: `/user`,
        port: 443,
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": "toy-publish",
        },
    }, function (resp) {
        let receiving = "";
        resp.on('data', function (chunk) {
            receiving += chunk.toString();
        });
        resp.on('end', function () {
            callback(JSON.parse(receiving));
        });
    });
    request.end();
}

function publish(req, resp) {
    let query = req.url.match(/^\/publish\?([\s\S]+)$/)[1];
    let info = querystring.parse(query);
    if (info.token) {
        getUser(info.token, function (userInfo) {
            console.log("login user:", userInfo.name);
            if (userInfo.name == "Sine Titan") {
                req.pipe(unzipper.Extract({ path: "../server/public/" }));
                req.on('end', () => resp.end("Success"));
            }
            else {
                resp.end("Auth failed");
            }
        });
    }
    else {
        resp.end("Auth failed");
    }
}

http.createServer(function(req, resp) {
    console.log("req url:", req.url);
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
