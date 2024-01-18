const express = require("express");
const path = require("path");
const rootDir = require("../lib/paths");

const products = [
  { title: "Book", price: "15" },
  { title: "Mobile", price: "150" },
];

const adminRoute = express.Router();

adminRoute.get("/add-product", (req, res, next) => {
  // sending response form ejs templeting engine
  res.render("./add-product.ejs", { docTitle: "Add Product" });
});

// receiving post request
adminRoute.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/admin/add-product");
});

module.exports = { adminRoute, products };
