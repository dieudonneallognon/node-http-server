const http = require("http");

const BASE_URL = "/";

const METHOD_GET = "GET";

const server = http.createServer((req, res) => {
    try {
        if (req.method === METHOD_GET && req.url === BASE_URL) {
            res.writeHead(200, { "content-type": "text/html" });
            res.write("<h1>HELLO WORLD Dieudonné !</h1>");
        } else {
            res.writeHead(404, { "content-type": "text/html" });
            res.write("<h1>404 Page introuvale !</h1>");
        }
    } catch (e) {
        res.writeHead(500, { "content-type": "text/html" });
        res.write("<h1>500 Erreur Interne au Serveur !</h1>");
    }
    res.end();
});

server.listen(5000);
