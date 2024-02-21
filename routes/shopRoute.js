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
const { isLoggedIn } = require("../controllers/protected-route-controller");

const shopRoute = express.Router();
// isLoggedIn controller checkes whether the current user have valid isLoggedIn and userId value in session
// if the session has valid values, it let pass the request to the next controller.
shopRoute.get("/products", getProducts);
shopRoute.get("/products/:productId", getProductById);
shopRoute.get("/cart", isLoggedIn, getCart);
shopRoute.post("/cart", isLoggedIn, postAddToCart);
shopRoute.post("/cart-remove", isLoggedIn, postRemoveFromCart);
shopRoute.post("/create-order", isLoggedIn, postOrder);
shopRoute.get("/orders", isLoggedIn, getOrders);
shopRoute.get("/", getHomePage);

module.exports = shopRoute;
