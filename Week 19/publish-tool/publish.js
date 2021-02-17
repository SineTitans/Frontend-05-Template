let http = require('http');
let fs = require('fs');

let request = http.request({
    hostname: "172.30.167.94",
    port: 8082,
    method: "POST",
    headers: {
        'Content-Type': 'application/octet-stream',
    }
}, resp => resp.pipe(process.stdout));

let file = fs.createReadStream("./sample.html");
file.pipe(request);