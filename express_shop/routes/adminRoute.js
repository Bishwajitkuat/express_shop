const express = require("express");
const path = require("path");
const rootDir = require("../lib/paths");

const products = [{ title: "Book" }, { title: "Mobile" }];

const adminRoute = express.Router();

adminRoute.get("/add-product", (req, res, next) => {
  res.render("./add-product.pug", { docTitle: "Add product" });
});

// receiving post request
adminRoute.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/admin/add-product");
});

module.exports = { adminRoute, products };
