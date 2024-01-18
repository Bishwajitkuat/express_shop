const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // sending response form ejs templeting engine
  res.render("./add-product.ejs", { docTitle: "Add Product" });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/admin/add-product");
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.getAllProducts();
  res.render("./shop.ejs", { products, docTitle: "Shop" });
};
