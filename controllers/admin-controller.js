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
  const { title, imgUrl, description, user } = req.body;
  const price = Number(req.body.price);
  const newProduct = new Product(
    title,
    price,
    imgUrl,
    description,
    req.user._id
  );
  newProduct
    .save()
    .then((response) => res.redirect("/admin/products"))
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
  // price from input field comes as string, so converting it into number
  updatedProduct.price = Number(updatedProduct.price);
  // using updateProduct static method of Product class to update the product in db
  Product.updateProduct(updatedProduct)
    .then((response) => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/products");
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  if (id) {
    Product.deleteProductById(id)
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/products");
      });
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
