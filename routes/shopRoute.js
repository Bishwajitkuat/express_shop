const express = require("express");

const {
  getProducts,
  getHomePage,
} = require("../controllers/products-controller");

const shopRoute = express.Router();

shopRoute.get("/products", getProducts);
shopRoute.get("/", getHomePage);

module.exports = shopRoute;