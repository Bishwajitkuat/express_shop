const http = require("http");

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
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<body> <h1>Your message is received</h1> </body>");
    res.write("</html>");
    return res.end();
  }
  // if no route is matched, this response will be sent
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<body> <h1>Page not found</h1> </body>");
  res.write("</html>");
  res.end();
});

server.listen("3000", () => console.log("listening to port 3000"));
