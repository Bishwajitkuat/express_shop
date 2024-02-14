const Product = require("../models/product");
const User = require("../models/user");

// controllers for shop
exports.getHomePage = (req, res, next) => {
  // findAll() method will return all products in an array
  Product.find()
    .then((products) => {
      res.render("./shop/index.ejs", { products, docTitle: "Shop", path: "/" });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // findAll() method will return all products in an array
  Product.find()
    .then((products) => {
      res.render("./shop/product-list.ejs", {
        products,
        docTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("./shop/product-detail.ejs", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/products");
    });
};

exports.getCart = async (req, res, next) => {
  try {
    // fetching products in ref to current user
    const userWithCartItems = await req.user.populate("cart.items.productId");
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
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.postAddToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    // utility method of User model is used to add or increase the quanity of a product
    user.addToCart(productId).then((response) => res.redirect("/products"));
  } catch (err) {
    console.log(err);
    res.redirect("/products");
  }
};

exports.postRemoveFromCart = async (req, res, next) => {
  const { id, qty } = req.body;
  try {
    // utility method "removeFromCart" of User model is used to delete or decrease the quanity of a product in cart
    await req.user.removeFromCart(id, qty);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    res.redirect("/cart");
  }
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout.ejs", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.postOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // get cart associated to userId
    const cart = await User.getCart(userId);
    // will not allow if there is no items in cart
    if (cart.items.length > 0) {
      // add other info to cart to such as user info, delevery address, time, payment methods etc.
      const order = {
        ...cart,
        userId: userId.toString(),
        date: new Date().toISOString(),
      };
      // adding order entry to orders collection
      const response = await User.createOrder(order);
      // when order is successfull add to orders collection
      if (response.acknowledged === true) {
        // empty the cart and write back to db
        const response = await User.clearCart(userId);
        if (response.acknowledged === true) {
          res.redirect("/orders");
        }
      }
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
    const userId = req.user._id;
    const orders = await User.getOrders(userId);
    res.render("./shop/orders.ejs", {
      orders,
      docTitle: "Orders",
      path: "/orders",
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
