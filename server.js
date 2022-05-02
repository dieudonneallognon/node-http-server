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
        } else if (
            req.method === METHOD_GET &&
            req.url === "/public/images/image.jpg"
        ) {
            res.writeHead(200, { "content-type": "image/jpeg" });
            output = fs.readFileSync(
                path.resolve(__dirname, "public", "images/image.jpg")
            );
        } else if (
            req.method === METHOD_GET &&
            req.url === "/public/css/style.css"
        ) {
            res.writeHead(200, { "content-type": "text/css" });
            output = fs.readFileSync(
                path.resolve(__dirname, "public", "css/style.css")
            );
        } else if (
            req.method === METHOD_GET &&
            req.url === "/public/js/script.js"
        ) {
            res.writeHead(200, { "content-type": "application/x-javascript" });
            output = fs.readFileSync(
                path.resolve(__dirname, "public", "js/script.js")
            );
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
