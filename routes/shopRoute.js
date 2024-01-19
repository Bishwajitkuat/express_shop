const express = require("express");
const {
  getProducts,
  getHomePage,
  getCart,
  getCheckout,
  getOrders,
  getProductsById,
} = require("../controllers/shop-controller");

const shopRoute = express.Router();

shopRoute.get("/products", getProducts);
shopRoute.get("/products/:productId", getProductsById);
shopRoute.get("/cart", getCart);
shopRoute.get("/checkout", getCheckout);
shopRoute.get("/orders", getOrders);
shopRoute.get("/", getHomePage);

module.exports = shopRoute;
