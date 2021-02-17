let http = require('http');
let archiver = require('archiver');

const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

archive.directory('./sample/', false);
archive.finalize();

let request = http.request({
    hostname: "172.30.167.94",
    // hostname: "127.0.0.1",
    port: 8082,
    method: "POST",
    headers: {
        'Content-Type': 'application/octet-stream',
    }
}, resp => resp.pipe(process.stdout));

archive.pipe(request);
