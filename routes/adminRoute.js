const express = require("express");
const path = require("path");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
} = require("../controllers/admin-controller");

const adminRoute = express.Router();

adminRoute.get("/add-product", getAddProduct);

adminRoute.get("/products", getProducts);

// receiving post request
adminRoute.post("/add-product", postAddProduct);

module.exports = adminRoute;
