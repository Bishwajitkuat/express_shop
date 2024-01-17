const express = require("express");
const path = require("path");
const rootDir = require("../lib/paths");

const shopRoute = express.Router();

shopRoute.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = shopRoute;
