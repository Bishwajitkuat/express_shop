const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// controllers for shop
exports.getHomePage = async (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  try {
    // findAll() method will return all products in an array
    const products = await Product.find().populate("userId", "name");
    // passing isLoggedIn value for conditional rendering in navbar.
    return res.render("./shop/index.ejs", {
      products,
      docTitle: "Shop",
      path: "/",
      isLoggedIn,
      errorMessage: null,
      successMessage: null,
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

exports.getProducts = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;

  // findAll() method will return all products in an array
  Product.find()
    .populate("userId", "name")
    .then((products) => {
      // passing isLoggedIn value for conditional rendering in navbar.
      res.render("./shop/product-list.ejs", {
        products,
        docTitle: "Products",
        path: "/products",
        isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductById = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("./shop/product-detail.ejs", {
        product: product,
        docTitle: product.title,
        path: "/products",
        isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });
};

exports.getCart = async (req, res, next) => {
  try {
    // extracting isLoggedIn value from session
    const isLoggedIn = req.session.isLoggedIn;
    if (isLoggedIn && req.session.userId) {
      // fetching the user, userId is extracted from session.userId
      const user = await User.findById(req.session.userId);
      // fetching products in ref to current user
      const userWithCartItems = await user.populate("cart.items.productId");
      // taking only items array to calculate totalPrice and totalQuantity
      const items = userWithCartItems.cart.items;
      // calculating totalPrice and totalQuantity
      let totalQuantity = 0;
      let totalPrice = 0;
      for (let item of items) {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * item.productId.price;
      }
      // structuring cart object as expected in view
      const cart = {
        items,
        totalQuantity,
        totalPrice,
      };

      // rendering view and passing data to it
      res.render("./shop/cart.ejs", {
        cart: cart,
        docTitle: "Cart",
        path: "/cart",
        isLoggedIn,
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.postAddToCart = async (req, res, next) => {
  try {
    const { productId, fromCart } = req.body;
    // users needed to be logged in inorder to add item to cart
    if (req.session.isLoggedIn && req.session.userId) {
      // fetching the user, userId is extracted from session.userId
      const user = await User.findById(req.session.userId);
      // utility method of User model is used to add or increase the quanity of a product
      user.addToCart(productId).then((response) => {
        if (fromCart === "yes") {
          res.redirect("/cart");
        } else {
          res.redirect("/products");
        }
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/products");
  }
};

exports.postRemoveFromCart = async (req, res, next) => {
  const { id, qty } = req.body;
  try {
    // fetching the user, userId is extracted from session.userId
    const user = await User.findById(req.session.userId);
    // utility method "removeFromCart" of User model is used to delete or decrease the quanity of a product in cart
    await user.removeFromCart(id, qty);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    res.redirect("/cart");
  }
};

exports.getCheckout = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  res.render("./shop/checkout.ejs", {
    docTitle: "Checkout",
    path: "/checkout",
    isLoggedIn,
  });
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    const userWithCartData = await user.populate("cart.items.productId");
    const cart = userWithCartData.cart;
    // will not allow if there is no items in cart
    if (cart.items.length > 0) {
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
      res.redirect("/orders");
    } else {
      res.redirect("/cart");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // extracting isLoggedIn value from session
    const isLoggedIn = req.session.isLoggedIn;
    const userId = req.session.userId;
    if (isLoggedIn && userId) {
      const orders = await Order.find({ userId: userId });
      res.render("./shop/orders.ejs", {
        orders,
        docTitle: "Orders",
        path: "/orders",
        isLoggedIn,
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
