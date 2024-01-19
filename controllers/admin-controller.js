const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // sending response form ejs templeting engine
  res.render("./admin/add-product.ejs", {
    docTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imgUrl, description, price } = req.body;
  const product = new Product(title, imgUrl, description, price);
  product.save();
  res.redirect("/admin/add-product");
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.getAllProducts();
  res.render("./admin/products.ejs", {
    products,
    docTitle: "Admin Product",
    path: "/admin/products",
  });
};
