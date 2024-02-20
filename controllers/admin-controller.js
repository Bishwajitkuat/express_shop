const { z } = require("zod");
const {
  ProductAddInputSchema,
  ProductEditInputSchema,
  IsStringCanBeObjectIdSchema,
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
    req.flash("error", null);
    req.flash(
      "success",
      "Congratulations! You have successfully listed the product!"
    );
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
// it renders add-edit-product view for GET request in /admin/edit-product route.
exports.getEditProduct = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  try {
    // validating and converting params for productId with zod
    const validation = IsStringCanBeObjectIdSchema.safeParse(
      req.params.productId
    );
    // if productId params fails the validation , add-edit-product view will be rendered with error feedback from catch block
    if (validation.success === false)
      throw new Error(
        "Wrong type for product id. Please click edit button in product cart to edit your product!"
      );
    // validation is successfull, so extracting the validated and cleaned up productId data
    const productId = validation.data;
    const product = await Product.findById(productId);
    // if no product can not be found with the productId, add-edit-product view will be rendered with error feedback from catch block
    if (!product)
      throw new Error("No product is found with the given product Id!");
    // shoud check if the product belongs to the current user
    // if product does not belong to current user, add-edit-product view will be rendered with error feedbcack from catch block
    if (product.userId.toString() !== req.session.userId.toString())
      throw new Error(
        "One user is not allowed to edit products of other user!"
      );
    // fetching product object for this productId and sending the object to add-edit-product view
    return res.render("./admin/add-edit-product.ejs", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      isLoggedIn,
      product,
      editing: true,
      errorMessage: null,
      errors: null,
    });
  } catch (err) {
    // if any error is catched, add-edit-product view will be rendered with error message extracted from error message.
    console.log(err);
    const errorMessage = err?.message
      ? err.message
      : "Due to some technical problem, product update operation can not be performed now. Please try again later!";
    return res.render("./admin/add-edit-product.ejs", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      isLoggedIn,
      product: null,
      editing: false,
      errorMessage: errorMessage,
      errors: null,
    });
  }
};

exports.postEditProduct = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  try {
    // validating user input with zod schema
    const validation = ProductEditInputSchema.safeParse(req.body);
    // if validation fails, add-edit-product view will be rendered with feedbacks and prefilled input fields.
    if (validation.success === false) {
      const errors = validation.error.flatten().fieldErrors;
      // if validation fails for productId, will not continue, throw error, because productId comes from hidden fields, if it is change, then somethig is wrong.
      if (errors?._id)
        throw new Error(
          "Wrong product Id, this product can not be updated now. Please try again later!"
        );
      // rendering add-edit-product with error feedbacks
      return res.render("./admin/add-edit-product.ejs", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        isLoggedIn,
        product: req.body,
        editing: true,
        errorMessage: null,
        errors,
      });
    }
    // validation is successfull, extracting validated data
    const updatedProduct = validation.data;
    //we can feth the entry, modify it and save back agian to update an entry
    const product = await Product.findById(updatedProduct._id);
    // if no product can not be fetched, error will thrown, and renders feedback from catch block
    if (!product)
      throw new Error(
        "Sorry! there is problem updating the product. Please try again later!"
      );
    // if product does not belong to current user, error will be thrown, and renders feedback from catch block
    if (product.userId.toString() !== req.session.userId.toString())
      throw new Error(
        "Sorry! you can not edit product which does not belong to you!"
      );
    // all check has been passed, so updating and saving back the product in db.
    product.title = updatedProduct.title;
    product.price = updatedProduct.price;
    product.description = updatedProduct.description;
    product.imgUrl = updatedProduct.imgUrl;
    await product.save();
    req.flash("error", null);
    req.flash(
      "success",
      "Congratulations! You have successfully updated the product!"
    );
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    // if any error is catched, add-edit-product view will be rendered with feedback comes from error message.
    const errorMessage = err?.message
      ? err.message
      : "Sorry! this product can not be updated due to technical issues. Please try again later!";
    return res.render("./admin/add-edit-product.ejs", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      isLoggedIn,
      product: req.body,
      editing: true,
      errorMessage,
      errors: null,
    });
  }
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
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
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
        errorMessage,
        successMessage,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};
