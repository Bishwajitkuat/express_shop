const Product = require("../models/product");

// controllers for adding new product
exports.getAddProduct = (req, res, next) => {
  // sending response form ejs templeting engine
  res.render("./admin/add-edit-product.ejs", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imgUrl, description, price } = req.body;
  const product = new Product(title, imgUrl, description, price);
  product
    .save()
    .then((response) => {
      res.redirect("/admin/add-product");
    })
    .catch((err) => console.log(err));
};

// controllers for editing products
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  if (productId) {
    Product.getProductById(productId).then((product) => {
      // product could be false or an object
      if (product) {
        res.render("./admin/add-edit-product.ejs", {
          product,
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
        });
      }
    });
  }
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteProduct(id).then((status) => {
    // I shoud remove this product if it exists in cart
    console.log(status);
    res.redirect("/admin/products");
  });
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = req.body;
  // updateProduct method of Product classe will replace the old product with the updatedProduct
  Product.updateProduct(updatedProduct).then((status) => {
    // will return success or failed
    if (status === "success") {
      res.redirect("/admin/products");
    } else {
      res.redirect("/");
    }
  });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.getAllProducts();
  res.render("./admin/products.ejs", {
    products,
    docTitle: "Admin Product",
    path: "/admin/products",
  });
};
