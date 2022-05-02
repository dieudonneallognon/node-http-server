const http = require("http");

const server = http.createServer((req, res) => {
    res.write("HELLO WORLD Dieudonné");
    res.end();
});

server.listen(5000);
