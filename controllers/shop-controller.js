const Product = require("../models/product");
const Cart = require("../models/cart");

// controllers for shop
exports.getHomePage = (req, res, next) => {
  Product.getAllProducts().then((products) => {
    if (products) {
      res.render("./shop/index.ejs", { products, docTitle: "Shop", path: "/" });
    }
  });
};

exports.getProducts = (req, res, next) => {
  Product.getAllProducts().then((products) => {
    if (products) {
      res.render("./shop/product-list.ejs", {
        products,
        docTitle: "Shop",
        path: "/products",
      });
    }
  });
};

exports.getProductsById = (req, res, next) => {
  const productId = req.params.productId;
  Product.getProductById(productId).then((product) => {
    if (product) {
      res.render("./shop/product-detail.ejs", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    }
  });
};

exports.getCart = (req, res, next) => {
  res.render("./shop/cart.ejs", {
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res, next) => {
  const { productId, price } = req.body;
  Cart.addProduct(productId, price).then((status) => {
    if (status) res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout.ejs", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("./shop/orders.ejs", {
    docTitle: "Your orders",
    path: "/orders",
  });
};
