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

exports.getProductsById = async (req, res, next) => {
  const productId = req.params.productId;
  const products = await Product.getProductById(productId);
  res.render("./shop/product-detail.ejs", {
    product: products[0],
    docTitle: products[0].title,
    path: "/products",
  });
};

exports.getCart = (req, res, next) => {
  res.render("./shop/cart.ejs", {
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  console.log(productId);
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout.ejs", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("./shop/orders.ejs", {
    docTitle: "Your orders",
    path: "/orders",
  });
};
