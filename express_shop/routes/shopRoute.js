const express = require("express");
const path = require("path");
const rootDir = require("../lib/paths");
const { products } = require("../routes/adminRoute");

const shopRoute = express.Router();

shopRoute.get("/", (req, res, next) => {
  // for sending static html file
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  // for sending pug file response, we provied path from default path of pug templating engine
  // sending response from pug templeting engine
  // res.render("./shop.pug", { data: products, docTitle: "Shop" });
  // sending response through ejs templeting engine
  res.render("./shop.ejs", { products, docTitle: "Shop" });
});

module.exports = shopRoute;
