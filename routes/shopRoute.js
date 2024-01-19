const express = require("express");
const { getProducts, getHomePage } = require("../controllers/shop-controller");

const shopRoute = express.Router();

shopRoute.get("/products", getProducts);
shopRoute.get("/cart");
shopRoute.get("/checkout");
shopRoute.get("/", getHomePage);

module.exports = shopRoute;
