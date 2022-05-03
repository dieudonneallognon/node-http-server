const http = require("http");
const path = require("path");
const fs = require("fs");

const BASE_URL = "/";

const METHOD_GET = "GET";

const ASSETS = {
    REGEX: /\/public\/[A-Za-z0-9]+\/[A-Za-z0-9]+[.][A-Za-z0-9]+/,
    CONTENT_TYPES: {
        html: "text/html",
        css: "text/css",
        jpg: "image/jpg",
        jpeg: "image/jpg",
        js: "text/javascript",
    },
};

const server = http.createServer((req, res) => {
    const pagesPath = path.resolve(__dirname, "public", "pages");

    let output = "";

    try {
        if (req.method === METHOD_GET && req.url === BASE_URL) {
            res.writeHead(200, { "content-type": ASSETS.CONTENT_TYPES.html });
            output = fs.readFileSync(path.resolve(pagesPath, "index.html"));
        } else if (req.method === METHOD_GET && req.url.match(ASSETS.REGEX)) {
            res.writeHead(200, {
                "content-type": ASSETS.CONTENT_TYPES[req.url.split(".").pop()],
            });
            output = fs.readFileSync(
                path.resolve(__dirname, ...req.url.split("/"))
            );
        } else {
            res.writeHead(404, { "content-type": "text/html" });
            output = fs.readFileSync(path.resolve(pagesPath, "error_404.html"));
        }
    } catch (e) {
        console.log(e);
        res.writeHead(500, { "content-type": "text/html" });
        output = fs.readFileSync(path.resolve(pagesPath, "error_500.html"));
    }
    res.write(output);
    res.end();
});

server.listen(5000);
