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
  const newProduct = new Product(title, price, imgUrl, description);
  newProduct
    .save()
    .then((response) => {
      console.log(response);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// controllers for editing products
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  if (productId) {
    // fetching product object for this productId and sending the object to add-edit-product view
    Product.getProductById(productId)
      .then((product) => {
        res.render("./admin/add-edit-product.ejs", {
          product,
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/products");
      });
    // if product id does not exist or could not be found from params, user will be redirected to /admin/products page
  } else res.redirect("/admin/products");
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
  Product.getAllProducts()
    .then((products) =>
      res.render("./admin/products.ejs", {
        products,
        docTitle: "Admin Product",
        path: "/admin/products",
      })
    )
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};
