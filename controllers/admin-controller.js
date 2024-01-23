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
  if (productId && req.user) {
    // fetching the product and send it view only if it belongs to current user
    req.user.getProducts({ where: { id: productId } }).then((products) => {
      res.render("./admin/add-edit-product.ejs", {
        product: products[0],
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
  // existing product will be updated only if both existing and updated product from POST request belongs to current user.
  req.user
    .getProducts({ where: { id: updatedProduct.id } })
    .then((products) => {
      const product = products[0];
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
  if (id && req.user) {
    // Deletion of the product will only carried out, if the product belongs to current user
    req.user
      .getProducts({ where: { id: id } })
      .then((products) => products[0].destroy())
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => console.log(err));
  }
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) =>
      res.render("./admin/products.ejs", {
        products,
        docTitle: "Admin Product",
        path: "/admin/products",
      })
    )
    .catch((err) => console.log(err));
};
