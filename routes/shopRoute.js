const express = require("express");
const {
  getProducts,
  getHomePage,
  getCart,
  postAddToCart,
  postRemoveFromCart,
  getCheckout,
  getOrders,
  getProductById,
  postOrder,
} = require("../controllers/shop-controller");

const shopRoute = express.Router();

shopRoute.get("/products", getProducts);
shopRoute.get("/products/:productId", getProductById);
shopRoute.get("/cart", getCart);
shopRoute.post("/cart", postAddToCart);
shopRoute.post("/cart-remove", postRemoveFromCart);
shopRoute.get("/checkout", getCheckout);
shopRoute.post("/create-order", postOrder);
shopRoute.get("/orders", getOrders);
shopRoute.get("/", getHomePage);

module.exports = shopRoute;
