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
  const { title, imgUrl, description } = req.body;
  const price = Number(req.body.price);
  // as user is a sequelize object and it has one to many relatinship with Product model, it will have createProduct() method
  // which takes product object as argument and creates and store product data with relationship info
  req.user
    .createProduct({
      title: title,
      imgUrl: imgUrl,
      description: description,
      price: price,
    })
    .then((response) => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

// controllers for editing products
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  if (productId) {
    Product.findByPk(productId).then((product) => {
      res.render("./admin/add-edit-product.ejs", {
        product,
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
      });
    });
  }
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = req.body;
  // save() method of entry will save the updated entry
  Product.findByPk(updatedProduct.id)
    .then((product) => {
      product.title = updatedProduct.title;
      product.price = Number(updatedProduct.price);
      product.imgUrl = updatedProduct.imgUrl;
      product.description = updatedProduct.description;
      return product.save();
    })
    .then((response) => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.destroy({ where: { id: id } })
    .then((response) => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("./admin/products.ejs", {
        products,
        docTitle: "Admin Product",
        path: "/admin/products",
      })
    )
    .catch((err) => console.log(err));
};
