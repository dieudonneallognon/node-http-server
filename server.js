const http = require("http");
const path = require("path");
const fs = require("fs");

const BASE_URL = "/";

const METHOD_GET = "GET";

const server = http.createServer((req, res) => {
    const pagesPath = path.resolve(__dirname, "public", "pages");

    let output = "";

    try {
        if (req.method === METHOD_GET && req.url === BASE_URL) {
            res.writeHead(200, { "content-type": "text/html" });
            output = fs.readFileSync(path.resolve(pagesPath, "index.html"));
        } else {
            res.writeHead(404, { "content-type": "text/html" });
            output = fs.readFileSync(path.resolve(pagesPath, "error_404.html"));
        }
    } catch (e) {
        res.writeHead(500, { "content-type": "text/html" });
        output = fs.readFileSync(path.resolve(pagesPath, "error_500.html"));
    }
    res.write(output);
    res.end();
});

server.listen(5000);
