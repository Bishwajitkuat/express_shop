const express = require("express");

const adminRoute = express.Router();

adminRoute.get("/add-product", (req, res, next) => {
  res.send(
    '<form action="/add-product" method="POST"> <input type="text" name="product"> <input type="submit" value="Add product">  </form>'
  );
});

// receiving post request
adminRoute.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/add-product");
});

module.exports = adminRoute;
