let http = require('http');

let fs = require('fs');

let request = http.request({
    hostname: "127.0.0.1",
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

let file = fs.createReadStream("./package.json");

file.on('data', function (chunk) {
    console.log(chunk.toString());
    request.write(chunk);
});
file.on('end', function () {
    console.log('read finished');
    request.end();
});