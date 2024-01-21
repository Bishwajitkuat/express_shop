const express = require("express");
const path = require("path");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
} = require("../controllers/admin-controller");

const adminRoute = express.Router();
// receiving GET request
adminRoute.get("/add-product", getAddProduct);
// receiving POST request
adminRoute.post("/add-product", postAddProduct);

// GET request for editing the product
adminRoute.get("/edit-product/:productId", getEditProduct);

adminRoute.get("/products", getProducts);

module.exports = adminRoute;
