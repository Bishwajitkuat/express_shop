const http = require("http");
const fs = require("fs");

const server = http.createServer(async (req, res) => {
  const url = req.url;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Sent Message</title></head>");
    // we are sinding a POST request to /message route with the form data;
    res.write(
      '<body> <form action="/message" method="POST"><input name="message" type="text"> <button type="submit" >Submit</button></form></body>'
    );
    res.write("</html>");
    // we must use return because we do not want end the execution here
    return res.end();
  } else if (url === "/message" && req.method === "POST") {
    const data = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    return req.on("end", () => {
      const parseData = Buffer.concat(data).toString();
      const message = parseData.split("=")[1].replaceAll("+", " ");
      // writeFileSync will block further operation, we can add a callback func into writeFile method to add non-blocking behaviour
      fs.writeFile("message.txt", message, (err) => {
        // should handle err if there is any
        // Sending status code with response
        res.statusCode = 302;
        // // Rederecting to root route by passing "Location" as header name and "/" as value
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  // if no route is matched, this response will be sent
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<body> <h1>Page not found</h1> </body>");
  res.write("</html>");
  res.end();
});

server.listen("3000", () => console.log("listening to port 3000"));
