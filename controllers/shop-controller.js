const Product = require("../models/product");

// controllers for shop
exports.getHomePage = async (req, res, next) => {
  const products = await Product.getAllProducts();
  res.render("./shop/index.ejs", { products, docTitle: "Shop", path: "/" });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.getAllProducts();
  res.render("./shop/product-list.ejs", {
    products,
    docTitle: "Shop",
    path: "/products",
  });
};

exports.getCart = (req, res, next) => {
  res.render("./shop/cart.ejs", {
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout.ejs", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};
