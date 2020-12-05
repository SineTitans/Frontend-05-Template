const net = require('net');

class TrunkedBodyParser {
    constructor() {
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char) {
        switch (this.current) {
            case this.WAITING_LENGTH: {
                if (char === '\r') {
                    if (this.length === 0) {
                        this.isFinished = true;
                    }
                    this.current = this.WAITING_LENGTH_LINE_END;
                }
                else {
                    this.length *= 16;
                    this.length += Number.parseInt(char, 16);
                }
            } break;
            case this.WAITING_LENGTH_LINE_END: {
                if (char === '\n') {
                    this.current = this.READING_TRUNK;
                }
            } break;
            case this.READING_TRUNK: {
                if (this.length) {
                    this.content.push(char);
                    this.length--;
                }
                if (this.length === 0) {
                    this.current = this.WAITING_NEW_LINE;
                }
            } break;
            case this.WAITING_NEW_LINE: {
                if (char === '\r') {
                    this.current = this.WAITING_NEW_LINE_END;
                }
            } break;
            case this.WAITING_NEW_LINE_END: {
                if (char === '\n') {
                    this.current = this.WAITING_LENGTH;
                }
            } break;
        }
    }
}

TrunkedBodyParser.prototype.WAITING_LENGTH = 0;
TrunkedBodyParser.prototype.WAITING_LENGTH_LINE_END = 1;
TrunkedBodyParser.prototype.READING_TRUNK = 2;
TrunkedBodyParser.prototype.WAITING_NEW_LINE = 3;
TrunkedBodyParser.prototype.WAITING_NEW_LINE_END = 4;

class ResponseParser {
    constructor() {
        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join(''),
        };
    }

    receive(string) {
        for (let ch of string) {
            this.receiveChar(ch);
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
                    if (this.headers['Transfer-Encoding'] === 'chunked')
                        this.bodyParser = new TrunkedBodyParser();
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
                if (char === '\n') {
                    this.current = this.WAITING_BODY;
                }
            } break;
            case this.WAITING_BODY: {
                this.bodyParser.receiveChar(char);
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
                // console.log(data.toString());
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

module.exports = {
    Request,
};
