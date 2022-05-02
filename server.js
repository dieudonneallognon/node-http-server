const http = require("http");

const BASE_URL = "/";

const METHOD_GET = "GET";

const server = http.createServer((req, res) => {
    if (req.method === METHOD_GET && req.url === BASE_URL) {
        res.writeHead(400, { "content-type": "text/html" });
        res.write("<h1>HELLO WORLD Dieudonné !</h1>");
    }
    res.end();
});

server.listen(5000);
