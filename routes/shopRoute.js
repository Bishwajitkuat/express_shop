const express = require("express");
const {
  getProducts,
  getHomePage,
  getCart,
  getCheckout,
} = require("../controllers/shop-controller");

const shopRoute = express.Router();

shopRoute.get("/products", getProducts);
shopRoute.get("/cart", getCart);
shopRoute.get("/checkout", getCheckout);
shopRoute.get("/", getHomePage);

module.exports = shopRoute;
