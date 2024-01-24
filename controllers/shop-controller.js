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
  Product.findByPk(productId)
    .then((product) => {
      res.render("./shop/product-detail.ejs", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res, next) => {
  try {
    // as User has one to one relationship with Cart, instance of User has getCart() method to fetch the cart associated with the user
    const cart = await req.user.getCart();
    // as Cart has many to many relationship with Product, instance of Cart has getProducts() method to fetch all Product intances associated with the Cart instance.
    const products = await cart.getProducts();
    // calculating total price and total quantity
    let totalPrice = 0;
    let totolQty = 0;
    for (let product of products) {
      totalPrice += product.price * product.cartItem.quantity;
      totolQty += product.cartItem.quantity;
    }
    // creating cart object for the view
    const cartForView = {
      products,
      totalPrice,
      totolQty,
    };
    // rendering view and passing data to it
  res.render("./shop/cart.ejs", {
      cart: cartForView,
    docTitle: "Cart",
    path: "/cart",
  });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
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
