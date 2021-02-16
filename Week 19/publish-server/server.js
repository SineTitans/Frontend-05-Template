let http = require('http');
let fs = require('fs');

http.createServer(function(req, resp) {
    console.log(req.headers);

    let outFile = fs.createWriteStream("../server/public/index.html");

    req.on('data', function (chunk) {
        outFile.write(chunk);
    });
    req.on('end', function () {
        outFile.end();
        resp.end("Success");
    });
}).listen(8082);