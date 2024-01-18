const express = require("express");
const path = require("path");
const {
  getAddProduct,
  postAddProduct,
} = require("../controllers/products-controller");

const adminRoute = express.Router();

adminRoute.get("/add-product", getAddProduct);

// receiving post request
adminRoute.post("/add-product", postAddProduct);

module.exports = adminRoute;
