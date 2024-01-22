const Product = require("../models/product");
const Cart = require("../models/cart");

// controllers for shop
exports.getHomePage = (req, res, next) => {
  // findAll() method will return all products in an array
  Product.findAll()
    .then((products) => {
      res.render("./shop/index.ejs", { products, docTitle: "Shop", path: "/" });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // findAll() method will return all products in an array
  Product.findAll()
    .then((products) => {
      res.render("./shop/product-list.ejs", {
        products,
        docTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
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

exports.getCart = async (req, res, next) => {
  const cart = await Cart.getCart();
  const products = await Product.getAllProducts();
  const productsWithQty = [];
  if (cart.products.length > 0) {
    // if cart.products is empty, following code will cause error
    for (let item of cart.products) {
      const product = products.find((prod) => prod.id === item.id);
      item.title = product.title;
      item.imgUrl = product.imgUrl;
      productsWithQty.push(item);
    }
  }
  cart.products = productsWithQty;
  res.render("./shop/cart.ejs", {
    cart,
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.postAddToCart = (req, res, next) => {
  const { productId, price } = req.body;
  Cart.addProduct(productId, price).then((status) => {
    if (status) res.redirect("/cart");
  });
};

exports.postRemoveFromCart = (req, res, next) => {
  const { id, qty } = req.body;
  Cart.removeProduct(id, qty).then((status) => {
    if (status === "success") res.redirect("/cart");
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
