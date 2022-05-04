const http = require("http");
const path = require("path");
const fs = require("fs");

const BASE_URL = "/";

const METHOD = {
    GET: "GET",
    POST: "POST",
};

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

MEMORY_DB.DATA.set(MEMORY_DB.INDEX++, { nom: "Alice" }); // voici comment set une nouvelle entrée.
MEMORY_DB.DATA.set(MEMORY_DB.INDEX++, { nom: "Bob" });
MEMORY_DB.DATA.set(MEMORY_DB.INDEX++, { nom: "Charlie" });

const server = http.createServer((req, res) => {
    const pagesPath = path.resolve(__dirname, "public", "pages");

    let output = "";

    try {
        switch (req.method) {
            case METHOD.GET: {
                if (req.url === BASE_URL) {
                    res.writeHead(200, {
                        "content-type": ASSETS.CONTENT_TYPES.html,
                    });
                    output = fs.readFileSync(
                        path.resolve(pagesPath, "index.html")
                    );
                } else if (req.url.match(ASSETS.REGEX)) {
                    res.writeHead(200, {
                        "content-type":
                            ASSETS.CONTENT_TYPES[req.url.split(".").pop()],
                    });
                    output = fs.readFileSync(
                        path.resolve(__dirname, ...req.url.split("/"))
                    );
                } else if (req.url === "/api/names") {
                    res.writeHead(200, {
                        "content-type": ASSETS.CONTENT_TYPES.json,
                    });
                    output = JSON.stringify(Array.from(MEMORY_DB.DATA));
                } else if (req.url.match(/\/api\/names\/[0-9]+/)) {
                    res.writeHead(200, {
                        "content-type": ASSETS.CONTENT_TYPES.json,
                    });

                    output = JSON.stringify(
                        MEMORY_DB.DATA.get(Number(req.url.split("/").pop())) ??
                            {}
                    );
                } else {
                    res.writeHead(404, { "content-type": "text/html" });
                    output = fs.readFileSync(
                        path.resolve(pagesPath, "error_404.html")
                    );
                }
                res.write(output);
                res.end();
                break;
            }
            case METHOD.POST: {
                if (req.url === "/api/names") {
                    let data = "";
                    req.on("data", (chunk) => {
                        data += chunk;
                    });
                    req.on("end", () => {
                        res.writeHead(201, {
                            "content-type": ASSETS.CONTENT_TYPES.json,
                        });

                        MEMORY_DB.DATA.set(
                            MEMORY_DB.INDEX++,
                            JSON.parse(data).name
                        );

                        res.write(
                            JSON.stringify({
                                id: MEMORY_DB.INDEX - 1,
                                name:
                                    MEMORY_DB.DATA.get(MEMORY_DB.INDEX - 1) ??
                                    "",
                            })
                        );

                        res.end();
                    });
                }
            }
        }
    } catch (e) {
        console.log(e);
        res.writeHead(500, { "content-type": "text/html" });
        res.write(fs.readFileSync(path.resolve(pagesPath, "error_500.html")));
    }
});

server.listen(5000);
