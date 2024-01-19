const Product = require("../models/product");

// controllers for shop
exports.getHomePage = (req, res, next) => {
  res.render("./shop/index.ejs", { docTitle: "Shop", path: "/" });
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
    products,
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout.ejs", {
    products,
    docTitle: "Checkout",
    path: "/checkout",
  });
};
