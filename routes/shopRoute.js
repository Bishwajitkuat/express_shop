const express = require("express");
const path = require("path");
const rootDir = require("../lib/paths");
const { products } = require("../routes/adminRoute");

const shopRoute = express.Router();

shopRoute.get("/", (req, res, next) => {
  // sending response through ejs templeting engine
  res.render("./shop.ejs", { products, docTitle: "Shop" });
});

module.exports = shopRoute;
