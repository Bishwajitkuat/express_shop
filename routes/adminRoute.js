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
const { isLoggedIn } = require("../controllers/protected-route-controller");

const adminRoute = express.Router();

// isLoggedIn controller checkes whether the current user have valid isLoggedIn and userId value in session
// if the session has valid values, it let pass the request to the next controller.
// receiving GET request
adminRoute.get("/add-product", isLoggedIn, getAddProduct);
// receiving POST request
adminRoute.post("/add-product", isLoggedIn, postAddProduct);

// GET request for editing the product
adminRoute.get("/edit-product/:productId", isLoggedIn, getEditProduct);

// POST request for editing the product
adminRoute.post("/edit-product/", isLoggedIn, postEditProduct);

// POST request for deleting the product
adminRoute.post("/delete-product/", isLoggedIn, postDeleteProduct);

adminRoute.get("/products", isLoggedIn, getProducts);

module.exports = adminRoute;
