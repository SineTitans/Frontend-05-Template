let http = require('http');
let fs = require('fs');

http.createServer(function(req, resp) {
    let outFile = fs.createWriteStream("../server/public/index.html");
    req.pipe(outFile);
    req.on('end', () => resp.end("Success"));
}).listen(8082);