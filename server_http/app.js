const http = require("http");

const server = http.createServer((req, res) => {
  // URL
  console.log("URL");
  console.log(req.url);
  // METHOD
  console.log("METHOD");
  console.log(req.method);
  // HEADERS
  console.log("HEADERS");
  console.log(req.headers);
  res.end();
});

server.listen("3000", () => console.log("listening to port 3000"));
