let http = require('http');

http.createServer(function(req, resp) {
    console.log(req.headers);
    req.on('data', function (chunk) {
        console.log(chunk.toString());
    });
    req.on('end', function () {
        resp.end("Success");
    });
}).listen(8082);