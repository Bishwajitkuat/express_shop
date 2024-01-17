// importing express module
const express = require("express");

// importing body-parser module
const bodyParser = require("body-parser");

// creating app
const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/add-product", (req, res, next) => {
  res.send(
    '<form action="/add-product" method="POST"> <input type="text" name="product"> <input type="submit" value="Add product">  </form>'
  );
});

// receiving post request
app.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/add-product");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello from express!!!</h1>");
});

// creating server which will listening to port
app.listen(3000, () => console.log("listening at port 3000"));
