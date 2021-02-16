let http = require('http');
let fs = require('fs');

let request = http.request({
    hostname: "172.18.0.76",
    port: 8082,
    method: "POST",
    headers: {
        'Content-Type': 'application/octet-stream',
    }
}, function (resp) {
    console.log('result headers:', resp.headers);
    resp.on('data', function (chunk) {
        console.log(chunk.toString());
    });
    resp.on('end', function () {
        console.log('complete.');
    })
});

let file = fs.createReadStream("./sample.html");

file.on('data', function (chunk) {
    console.log(chunk.toString());
    request.write(chunk);
});
file.on('end', function () {
    console.log('read finished');
    request.end();
});