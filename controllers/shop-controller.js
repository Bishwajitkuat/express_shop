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
