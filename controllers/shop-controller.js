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
    // extracting userId
    const userId = req.user._id;
    // fetching cart to this user
    const cart = await User.getCart(userId);
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
    const { productId, fromCart } = req.body;
    const userId = req.user._id;
    const cart = await User.getCart(userId);
    let items = cart.items;

    // checking whether the product already in items array in cart
    // tow object never be same, so i am converting mongo db id object to string to compare.
    const indexInItemsArryOfCart = items.findIndex(
      (item) => item._id.toString() == productId
    );

    if (indexInItemsArryOfCart === -1) {
      // this product does not exists in item array of cart
      // we need to fetch the product, add quantity to the product and push into items array
      const product = await Product.getProductById(productId);
      product.quantity = 1;
      items.push(product);
    } else {
      // product is already exists we need to adjust the quantity of the product
      const updatedProduct = items[indexInItemsArryOfCart];
      updatedProduct.quantity += 1;
      items[indexInItemsArryOfCart] = updatedProduct;
    }
    // calculating updated totalQuantity and totalPrice
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let item of items) {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price;
    }
    // updating cart with updated totalQuantity and totalPrice
    const updatedCart = {
      items,
      totalQuantity,
      totalPrice,
    };
    // storing updated cart into db
    User.updateCart(userId, updatedCart).then((response) => {
      // if user add items from cart view it will riderect to cart view
      if (fromCart === "yes") {
        res.redirect("/cart");
      } else {
        // if user add items from other pages it will be redirected to /products route
        res.redirect("/products");
      }
    });
  } catch (err) {
    console.log(err);
    res.redirect("/products");
  }
};

exports.postRemoveFromCart = async (req, res, next) => {
  const { id, qty } = req.body;
  const userId = req.user._id;
  try {
    const cart = await User.getCart(userId);
    let items = cart.items;
    // this controller can not be called if the product does not exists in items array in cart
    // so I am assuming the product already existed
    const productIndex = items.findIndex((item) => item._id.toString() === id);
    const product = items[productIndex];
    // updating new qty
    product.quantity = product.quantity - Number(qty);
    if (product.quantity < 1) {
      // removing the product from items array
      items.splice(productIndex, 1);
    } else {
      // updating items array with updated qty
      items[productIndex] = product;
    }
    // calculating updated totalQuantity and totalPrice
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let item of items) {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price;
    }
    // updating cart with updated totalQuantity and totalPrice
    const updatedCart = {
      items,
      totalQuantity,
      totalPrice,
    };
    // storing updated cart into db
    User.updateCart(userId, updatedCart).then((response) =>
      res.redirect("/cart")
    );
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
