const express = require("express");

const { getProducts } = require("../controllers/products-controller");

const shopRoute = express.Router();

shopRoute.get("/", getProducts);

module.exports = shopRoute;
