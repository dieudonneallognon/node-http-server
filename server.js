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
        json: "application/json",
    },
};

MEMORY_DB = {
    INDEX: 0,
    DATA: new Map(),
};

const server = http.createServer((req, res) => {
    MEMORY_DB.DATA.set(MEMORY_DB.INDEX++, { nom: "Alice" }); // voici comment set une nouvelle entrée.
    MEMORY_DB.DATA.set(MEMORY_DB.INDEX++, { nom: "Bob" });
    MEMORY_DB.DATA.set(MEMORY_DB.INDEX++, { nom: "Charlie" });

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
        } else if (req.method === METHOD_GET && req.url === "/api/names") {
            res.writeHead(200, {
                "content-type": ASSETS.CONTENT_TYPES.json,
            });
            output = JSON.stringify(Array.from(MEMORY_DB.DATA));
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
