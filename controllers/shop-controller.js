const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { z } = require("zod");
const { buildInvioice } = require("../lib/pdf-service");
const {
  IsStringCanBeObjectIdSchema,
  PostAddToCartInputSchema,
  PostRemoveFromCartInputSchema,
} = require("../lib/zod-validation/product-validation-schemas");
const { getCartFromUserId } = require("../lib/get-cart-from-userId");

// controllers for shop
exports.getHomePage = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  try {
    // findAll() method will return all products in an array
    const products = await Product.find().populate("userId", "name");
    // passing isLoggedIn value for conditional rendering in navbar.
    return res.render("./shop/index.ejs", {
      products,
      docTitle: "Shop",
      path: "/",
      isLoggedIn,
      errorMessage: errorMessage,
      successMessage: successMessage,
    });
  } catch (err) {
    console.log(err);
    return res.render("./shop/index.ejs", {
      products: null,
      docTitle: "Shop",
      path: "/",
      isLoggedIn,
      errorMessage: err?.message
        ? err.message
        : "Sorry! an error occured during data fetching. Please try again later!",
      successMessage: null,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  const productsPerPage = 3;
  try {
    // fetching total number of document in db
    const productCount = await Product.find().countDocuments();
    // calculating total number of pages
    const numberOfPages = Math.ceil(productCount / productsPerPage);
    let page = req?.query?.page ? req.query.page : 1;
    // checking page query value convertible to number
    const validation = z.coerce.number().safeParse(page);
    // if page query passes the validation, uses validated number value or default 1;
    page = validation.success === true ? validation.data : 1;
    // findAll() method will return all products in an array
    // limiting product fetching base on page query and productsPerPage values
    const products = await Product.find()
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage)
      .populate("userId", "name");
    return res.render("./shop/product-list.ejs", {
      products,
      // this will be used for pagination
      numberOfPages,
      // conditional styling of active page
      page,
      docTitle: "Products",
      path: "/products",
      // passing isLoggedIn value for conditional rendering in navbar.
      isLoggedIn,
      errorMessage: errorMessage,
      successMessage: successMessage,
    });
  } catch (err) {
    console.log(err);
    return res.render("./shop/product-list.ejs", {
      products: null,
      numberOfPages: null,
      page: null,
      docTitle: "Products",
      path: "/products",
      isLoggedIn,
      errorMessage: err?.message
        ? err.message
        : "Sorry! an error occured during data fetching. Please try again later!",
      successMessage: null,
    });
  }
};

exports.getProductById = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  try {
    // params data validation with zod.
    const validation = IsStringCanBeObjectIdSchema.safeParse(
      req.params.productId
    );
    // throw error, if params data fails to validate
    if (validation.success === false)
      throw new Error(
        "Invalid product id! No product can be found with this id!"
      );
    const product = await Product.findById(validation.data).populate(
      "userId",
      "name"
    );
    // if no product found with the id, throw error
    if (!product)
      throw new Error(
        "Sorry! The product your are looking for, no longer exists!"
      );
    // all checks are passed, passing the data into view
    return res.render("./shop/product-detail.ejs", {
      product: product,
      docTitle: product.title,
      path: "/products",
      isLoggedIn,
      errorMessage: null,
      successMessage: null,
    });
  } catch (err) {
    console.log(err);
    // if any error is catched, product-detail.ejs view will be rendered with error message
    return res.render("./shop/product-detail.ejs", {
      product: null,
      docTitle: "Error",
      path: "/products",
      isLoggedIn,
      errorMessage: err?.message
        ? err.message
        : "Sorry! an error occured during data fetching the product you are looking for. Please try again later!",
      successMessage: null,
    });
  }
};

exports.getCart = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  try {
    const cart = await getCartFromUserId(req.session.userId);
    // rendering view and passing data to it
    return res.render("./shop/cart.ejs", {
      cart,
      docTitle: "Cart",
      path: "/cart",
      isLoggedIn,
      successMessage: successMessage,
      errorMessage: errorMessage,
    });
  } catch (err) {
    console.log(err);
    // if any error is cought, cart view will be rendered with error messsage.
    return res.render("./shop/cart.ejs", {
      cart: null,
      docTitle: "Cart",
      path: "/cart",
      isLoggedIn,
      successMessage: null,
      errorMessage: err?.message
        ? err.message
        : "Sorry! an error occured during data fetching items in the cart. Please try again later!",
    });
  }
};

// handles POST request to /cart route
exports.postAddToCart = async (req, res, next) => {
  try {
    // validation for incoming data from post request with zod
    const validation = PostAddToCartInputSchema.safeParse(req.body);
    // if validation fails, throw error, input data comes hidden input fields
    if (validation.success === false)
      throw new Error(
        "Opps! an error occured during adding this product to cart. Please try again later!"
      );
    const { productId, fromCart } = validation.data;
    // fetching the user, userId is extracted from session.userId
    const user = await User.findById(req.session.userId);
    // utility method of User model is used to add or increase the quanity of a product
    await user.addToCart(productId);
    // if product adding to cart is successful, user will be redirected to same page with success message.
    req.flash("error", null);
    req.flash("success", "The product is successfully added to the cart!");
    if (fromCart === "yes") {
      return res.redirect("/cart");
    } else {
      return res.redirect("/products");
    }
  } catch (err) {
    console.log(err);
    // if any error occured, user will be redirected to /products route with error message.
    const errorMessage = err?.message
      ? err.message
      : "Opps! an error occured during adding this product to cart. Please try again later!";
    req.flash("error", errorMessage);
    req.flash("success", null);
    res.redirect("/products");
  }
};

// handles POST request to /cart-remove route
exports.postRemoveFromCart = async (req, res, next) => {
  try {
    // input data validation with zod schema
    const validation = PostRemoveFromCartInputSchema.safeParse(req.body);
    // if validation fails, throw error, input data comes hidden input fields
    if (validation.success === false)
      throw new Error(
        "Opps! an error occured during removing this product from cart. Please try again later!"
      );
    // fetching the user, userId is extracted from session.userId
    const user = await User.findById(req.session.userId);
    // utility method "removeFromCart" of User model is used to delete or decrease the quanity of a product in cart
    const { productId, quantity } = validation.data;
    await user.removeFromCart(productId, quantity);
    // if product removal is successfull, user will be redirected to /cart with status message.
    req.flash("error", null);
    req.flash("success", "The product is removed from cart!");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    // if any error occured, user will be redirected to /cart route with error message.
    const errorMessage = err?.message
      ? err.message
      : "Opps! an error occured during removing this product from cart. Please try again later!";
    req.flash("success", null);
    req.flash("error", errorMessage);
    res.redirect("/cart");
  }
};

// handles POST request to /create-order route
exports.postOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    const userWithCartData = await user.populate("cart.items.productId");
    const cart = userWithCartData.cart;
    // if cart is empty, throw error
    if (cart?.items?.length < 1)
      throw new Error(
        "Sorry! There is no item in cart to place a order! Please add items from products menue!"
      );
    // restructuring product objects as expected in itmes array in Order model
    const items = [];
    for (let item of cart.items) {
      items.push({
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
      });
    }
    // calculating totalQuantity and totalPrice
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    // creating order object as expected in Order model
    const order = new Order({
      items,
      totalQuantity,
      totalPrice,
      date: new Date().toISOString(),
      userId: userWithCartData._id,
    });
    await order.save();
    // useing clearCart utility method from UserSchema is used to reset the cart of this user.
    await userWithCartData.clearCart();
    // if placing oder is successfull, redirects user to /orders route with success message
    req.flash("error", null);
    req.flash(
      "success",
      "Congratulations! You have successfully placed the order!"
    );
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
    // if any error occured, user will be redirected to /cart route with error message.
    const errorMessage = err?.message
      ? err.message
      : "Opps! An error occured during placing the order. We are sorry for then inconvenience. Please try again later!";
    req.flash("success", null);
    req.flash("error", errorMessage);
    res.redirect("/cart");
  }
};

// handles GET request to /order route
exports.getOrders = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  try {
    const userId = req.session.userId;
    const orders = await Order.find({ userId: userId });
    return res.render("./shop/orders.ejs", {
      orders,
      docTitle: "Orders",
      path: "/orders",
      isLoggedIn,
      errorMessage,
      successMessage,
    });
  } catch (err) {
    console.log(err);
    // if any error occured, orders view will be rendered with error message.
    const errorMessage = err?.message
      ? err.message
      : "Opps! An error occured. We are sorry for then inconvenience. Please try again later!";
    return res.render("./shop/orders.ejs", {
      orders: null,
      docTitle: "Orders",
      path: "/orders",
      isLoggedIn,
      errorMessage: errorMessage,
      successMessage: null,
    });
  }
};

// handles get request to /orders/:orderId
exports.getDownloadInvoice = async (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  try {
    const validation = IsStringCanBeObjectIdSchema.safeParse(
      req.params.orderId
    );
    // if fails, throw error
    if (validation.success === false)
      throw new Error(
        "Wrong order id! Please clik download button in orders menue to download the invoice!"
      );
    // validation passes
    const orderId = validation.data;
    // fetching the order from db
    const order = await Order.findById({ _id: orderId });
    // if no order found, throw error
    if (!order)
      throw new Error(
        "Opps! An error occured. We are sorry for then inconvenience. Please try again later!"
      );
    // if the order does not belongs to current user, throw error
    if (order.userId.toString() !== req.session.userId.toString())
      throw new Error("Sorry! One user can not access other user invoice!");
    // creating and sending invoice to user as stream
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    });
    buildInvioice(
      order,
      (chunk) => stream.write(chunk),
      () => stream.end()
    );
  } catch (err) {
    console.log(err);
    // if any error occured, orders view will be rendered with error message.
    const errorMessage = err?.message
      ? err.message
      : "Opps! An error occured. We are sorry for then inconvenience. Please try again later!";
    return res.render("./shop/orders.ejs", {
      orders: null,
      docTitle: "Orders",
      path: "/orders",
      isLoggedIn,
      errorMessage: errorMessage,
      successMessage: null,
    });
  }
};
