const net = require('net');

class ResponseParser {
    constructor() {
        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }

    receive(string) {
        for (let i = 0; i < string.length; ++i) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        switch (this.current) {
            case this.WAITING_STATUS_LINE: {
                if (char === '\r') {
                    this.current = this.WAITING_STATUS_LINE_END;
                }
                else {
                    this.statusLine += char;
                }
            } break;
            case this.WAITING_STATUS_LINE_END: {
                if (char === '\n') {
                    this.current = this.WAITING_HEADER_NAME;
                }
            } break;
            case this.WAITING_HEADER_NAME: {
                if (char === ':') {
                    this.current = this.WAITING_HEADER_SPACE;
                }
                else if (char === '\r') {
                    this.current = this.WAITING_HEADER_BLOCK_END;
                }
                else {
                    this.headerName += char;
                }
            } break;
            case this.WAITING_HEADER_SPACE: {
                if (char === ' ') {
                    this.current = this.WAITING_HEADER_VALUE;
                }
            } break;
            case this.WAITING_HEADER_VALUE: {
                if (char === '\r') {
                    this.current = this.WAITING_HEADER_LINE_END;
                    this.headers[this.headerName] = this.headerValue;
                    this.headerName = "";
                    this.headerValue = "";
                }
                else {
                    this.headerValue += char;
                }
            } break;
            case this.WAITING_HEADER_LINE_END: {
                if (char === '\n') {
                    this.current = this.WAITING_HEADER_NAME;
                }
            } break;
            case this.WAITING_HEADER_BLOCK_END: {
                if (char === '\r') {
                    this.current = this.WAITING_BODY;
                }
            } break;
            case this.WAITING_BODY: {
                console.log(char);
            } break;
        }
    }
}

ResponseParser.prototype.WAITING_STATUS_LINE = 0;
ResponseParser.prototype.WAITING_STATUS_LINE_END = 1;
ResponseParser.prototype.WAITING_HEADER_NAME = 2;
ResponseParser.prototype.WAITING_HEADER_SPACE= 3;
ResponseParser.prototype.WAITING_HEADER_VALUE= 4;
ResponseParser.prototype.WAITING_HEADER_LINE_END = 5;
ResponseParser.prototype.WAITING_HEADER_BLOCK_END = 6;
ResponseParser.prototype.WAITING_BODY = 7;

class Request {
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/";
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = "application/x-www-form-urlencoded";
        }

        if (this.headers['Content-Type'] === "application/json")
            this.bodyText = JSON.stringify(this.body);
        else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded")
            this.bodyText = Object.keys(this.body)
                .map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        
        this.headers['Content-Length'] = this.bodyText.length;
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.write(this.toString());
            }
            else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port,
                }, () => connection.write(this.toString()));
            }

            const parser = new ResponseParser;
            connection.on('data', data => {
                console.log(data.toString());
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });
            connection.on('error', err => {
                reject(err);
                connection.end();
            });
        });
    }
}

void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customized"
        },
        body: {
            name: "crescent"
        }
    });

    let resp = await request.send();

    console.log(resp);
}();