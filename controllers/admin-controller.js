const {
  ProductAddInputSchema,
} = require("../lib/zod-validation/product-validation-schemas");
const Product = require("../models/product");
const User = require("../models/user");

// controllers for adding new product
exports.getAddProduct = (req, res, next) => {
  try {
    // extracting isLoggedIn value from session
    const isLoggedIn = req.session.isLoggedIn;
    // sending response form ejs templeting engine
    res.render("./admin/add-edit-product.ejs", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      isLoggedIn,
      editing: false,
      errorMessage: null,
      product: null,
      errors: null,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin/products");
  }
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const isLoggedIn = req.session.isLoggedIn;
    // zod validation for user inputs
    const validation = ProductAddInputSchema.safeParse(req.body);
    // if validation fails, add-edit-product view will be rendered with prefilled value and feedback.
    if (validation.success === false) {
      const error = validation.error.flatten().fieldErrors;
      // creating errors and oldValue object to send into view
      const errors = {
        title: error?.title ? error?.title[0] : false,
        price: error?.price ? error?.price[0] : false,
        description: error?.description ? error?.description[0] : false,
        imgUrl: error?.imgUrl ? error?.imgUrl[0] : false,
      };
      // view's input fields will be prefield with the old values
      const product = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imgUrl: req.body.imgUrl,
      };
      // rendering add-edit-product view with prefilled input fields and feedback.
      return res.render("./admin/add-edit-product.ejs", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isLoggedIn,
        errorMessage: null,
        errors,
        product,
      });
    }
    // validation is successfull
    const { title, price, imgUrl, description } = validation.data;
    // fetching the user, userId is extracted from session.userId
    const user = await User.findById(req.session.userId);
    // if user can not be fetched, a error will be thrown, with a feedback
    if (!user) throw new Error("User can not be found!");
    // creating new product from Product modle
    const newProduct = new Product({
      title,
      price,
      imgUrl,
      description,
      userId: user._id,
    });
    // using mongoose's model's save mthod to store new instance to db
    await newProduct.save();
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    return res.render("./admin/add-edit-product.ejs", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: req.body,
      isLoggedIn: req.session.isLoggedIn,
      errorMessage:
        "Product can not be created due to some technical problem, please try again leter!",
      errors: null,
    });
  }
};

// controllers for editing products
exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  if (productId) {
    // fetching product object for this productId and sending the object to add-edit-product view
    // shoud check if the product belongs to the current user
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
  // shoud check if the product belongs to the current user
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
    // shoud check if the product belongs to the current user
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
