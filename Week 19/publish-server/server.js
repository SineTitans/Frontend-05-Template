let http = require('http');
let fs = require('fs');

http.createServer(function(req, resp) {
    console.log("req headers:", req.headers);
    let outFile = fs.createWriteStream("../server/public/index.html");
    req.pipe(outFile);
    req.on('end', () => resp.end("Success"));
}).listen(8082);