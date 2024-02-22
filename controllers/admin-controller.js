const { z } = require("zod");
const {
  ProductAddInputSchema,
  ProductEditInputSchema,
  IsStringCanBeObjectIdSchema,
  ImageValidationSchema,
} = require("../lib/zod-validation/product-validation-schemas");
const Product = require("../models/product");
const User = require("../models/user");
const { deleteFile } = require("../lib/file-system/delete-files");

// controller to handles GET request to /admin/products route
exports.getProducts = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  try {
    const error = req.flash("error");
    const errorMessage = error.length < 1 ? null : error;
    const success = req.flash("success");
    const successMessage = success.length < 1 ? null : success;
    const userId = req.session.userId;
    const products = await Product.find({ userId: userId });
    return res.render("./admin/products.ejs", {
      products,
      docTitle: "Admin Product",
      path: "/admin/products",
      isLoggedIn,
      errorMessage,
      successMessage,
    });
  } catch (err) {
    console.log(err);
    // if any error occures, /admin/products.ejs view will be rendered with error message
    return res.render("./admin/products.ejs", {
      products: null,
      docTitle: "Admin Product",
      path: "/admin/products",
      isLoggedIn,
      errorMessage: err?.message
        ? err.message
        : "Sorry! Error occured during data fetching from database. Please try again later!",
      successMessage: null,
    });
  }
};

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
    // validation image with zod
    // if user does not upload image req.file will be undefined, zod does not validation if it is undefined.
    const imgValidation = ImageValidationSchema.safeParse(req.file || {});
    // zod validation for user inputs
    const validation = ProductAddInputSchema.safeParse(req.body);
    // if validation fails, add-edit-product view will be rendered with prefilled value and feedback.
    if (validation.success === false || imgValidation === false) {
      // creating errors and oldValue object to send into view
      const inputErrors =
        validation.success === false
          ? validation.error.flatten().fieldErrors
          : {};
      const imgErrors =
        imgValidation.success === false
          ? imgValidation.error.flatten().fieldErrors
          : {};
      const errors = { ...inputErrors, ...imgErrors };
      //if validation fails, uploded image will be deleted.
      if (req?.file?.path) deleteFile(req.file.path);

      // rendering add-edit-product view with prefilled input fields and feedback.
      return res.render("./admin/add-edit-product.ejs", {
        docTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isLoggedIn,
        errorMessage: null,
        errors,
        // view's input fields will be prefield with the old values
        product: req.body,
      });
    }
    // validation is successfull
    const { title, price, description } = validation.data;
    const imgUrl = imgValidation.data.path;
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
    // global variables for this function
    const isNewImageUploaded = req.file ? true : false;
    let imgErrors = {};
    let inputErrors = {};
    let isImageValidationFailed = false;
    let isInputValidationFailed = false;

    // validation of image
    // image validatin only be done if new image is uploaded
    if (isNewImageUploaded) {
      const imgValidation = ImageValidationSchema.safeParse(req.file);
      if (imgValidation.success === false) {
        imgErrors = imgValidation.error.flatten().fieldErrors;
        isImageValidationFailed = true;
        // removing the currently uploaded file which fails to validate
        deleteFile(req?.file?.path);
      }
    }
    // validating user input with zod schema
    const validation = ProductEditInputSchema.safeParse(req.body);
    if (validation.success === false) {
      inputErrors = validation.error.flatten().fieldErrors;
      isInputValidationFailed = true;
    }
    // if either or both validations fails, add-edit-product view will be rendered with feedbacks and prefilled input fields.
    if (isInputValidationFailed || isImageValidationFailed) {
      // if validation fails for productId, will not continue, throw error, because productId comes from hidden fields, if it is change, then somethig is wrong.
      if (inputErrors?._id)
        throw new Error(
          "Wrong product Id, this product can not be updated now. Please try again later!"
        );
      // creating total errors object
      const errors = { ...imgErrors, ...inputErrors };
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
    // if new image is uploaded and passed the validation, old image path will be replaced with new image path
    const updated_imgUrl = isNewImageUploaded ? req.file.path : product.imgUrl;
    // old image will be deleted
    if (isNewImageUploaded) deleteFile(product.imgUrl);
    // all check has been passed, so updating and saving back the product in db.
    product.title = updatedProduct.title;
    product.price = updatedProduct.price;
    product.description = updatedProduct.description;
    product.imgUrl = updated_imgUrl;
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

// handles POST request to /delete-product/ route
exports.postDeleteProduct = async (req, res, next) => {
  try {
    // validation with zod schema
    const validation = IsStringCanBeObjectIdSchema.safeParse(req.body.id);
    // if validation fails, throw error
    if (validation.success === false) throw new Error("Invalid product Id");
    // validation successfull
    const id = validation.data;
    const product = await Product.findById({ _id: id });
    // if product can not found with the id, throw error
    if (!product)
      throw new Error("The product, you are trying to delete, does not exist!");
    // if the product does not belong to current user, throw error
    if (product.userId.toString() !== req.session.userId.toString())
      throw new Error(
        "Sorry!, you can not delete a product which did not created by you!"
      );
    // if all checks are passed, deletes the product from db.
    await Product.findByIdAndDelete(id);
    // deleting the image file
    deleteFile(product.imgUrl);
    // user will be redirected with success feedback messsage
    req.flash("error", null);
    req.flash("success", "The product has been successfully deleted!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    // if any error is caught, user is redired to /admin/products route with feedback comes from error message.
    const errorMessage = err?.message
      ? err.message
      : "Sorry! due to some technical problem, the product cannot be deleted now. Please try again later!";
    req.flash("success", null);
    req.flash("error", errorMessage);
    res.redirect("/admin/products");
  }
};
