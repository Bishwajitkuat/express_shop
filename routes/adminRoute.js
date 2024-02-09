const express = require("express");
const path = require("path");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin-controller");

const adminRoute = express.Router();
// receiving GET request
adminRoute.get("/add-product", getAddProduct);
// receiving POST request
adminRoute.post("/add-product", postAddProduct);

// GET request for editing the product
// adminRoute.get("/edit-product/:productId", getEditProduct);

// POST request for editing the product
// adminRoute.post("/edit-product/", postEditProduct);

// POST request for deleting the product
// adminRoute.post("/delete-product/", postDeleteProduct);

// adminRoute.get("/products", getProducts);

module.exports = adminRoute;
