const Product = require("../models/product");
const User = require("../models/user");

// controllers for adding new product
exports.getAddProduct = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  // sending response form ejs templeting engine
  res.render("./admin/add-edit-product.ejs", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, imgUrl, description } = req.body;
  // fetching the user, userId is extracted from session.userId
  const user = await User.findById(req.session.userId);
  const price = Number(req.body.price);
  // creating new product from Product modle
  const newProduct = new Product({
    title,
    price,
    imgUrl,
    description,
    userId: user._id,
  });
  // using mongoose's model's save mthod to store new instance to db
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
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  if (productId) {
    // fetching product object for this productId and sending the object to add-edit-product view
    Product.findById(productId)
      .then((product) => {
        res.render("./admin/add-edit-product.ejs", {
          product,
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
          isLoggedIn,
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
  // mongoose does not have any derect method to update an entry hoever we can fethe the entry, modify it and save back agian to update an entry
  Product.findById(updatedProduct.id)
    .then((product) => {
      product.title = updatedProduct.title;
      product.price = updatedProduct.price;
      product.description = updatedProduct.description;
      product.imgUrl = updatedProduct.imgUrl;
      product
        .save()
        .then((response) => res.redirect("/admin/products"))
        .catch((err) => {
          console.log(err);
          res.redirect("/admin/products");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/products");
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  if (id) {
    Product.findByIdAndDelete(id)
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/products");
      });
  }
};

exports.getProducts = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  const userId = req.session.userId;
  Product.find({ userId: userId })
    .then((products) => {
      res.render("./admin/products.ejs", {
        products,
        docTitle: "Admin Product",
        path: "/admin/products",
        isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};
