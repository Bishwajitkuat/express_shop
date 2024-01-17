const express = require("express");
const shopRoute = express.Router();

shopRoute.use("/", (req, res, next) => {
  res.send("<h1>Hello from express!!!</h1>");
});

module.exports = shopRoute;
