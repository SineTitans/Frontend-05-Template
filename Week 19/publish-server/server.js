let http = require('http');
let unzipper = require('unzipper');

http.createServer(function(req, resp) {
    console.log("req headers:", req.headers);

    req.pipe(unzipper.Extract({ path: "../server/public/" }));
    req.on('end', () => resp.end("Success"));
}).listen(8082);
