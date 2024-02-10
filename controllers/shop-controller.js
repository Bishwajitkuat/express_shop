const Product = require("../models/product");

// controllers for shop
exports.getHomePage = (req, res, next) => {
  // findAll() method will return all products in an array
  Product.getAllProducts()
    .then((products) => {
      res.render("./shop/index.ejs", { products, docTitle: "Shop", path: "/" });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // findAll() method will return all products in an array
  Product.getAllProducts()
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
  Product.getProductById(productId)
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

exports.postAddToCart = async (req, res, next) => {
  try {
    const { productId, price } = req.body;
    const cart = await req.user.getCart();
    // checking whether the product already in cartItem table, retrun empty array if does not exits
    const isProductExists = await cart.getProducts({
      where: { id: productId },
    });
    if (isProductExists.length < 1) {
      // this product does not exists in cartItem (connecting) table for this user and product
      // we need to fetch the product, to add into cartItem table
      const product = await Product.findByPk(productId);
      // as Cart has many to many relationship with Product, it has addProduct().
      // as the connecting table (cartItem) holds info of quantity, we can update the connecting tables fields by through property
      await cart.addProduct(product, {
        through: { quantity: 1 },
      });
      res.redirect("/products");
    } else {
      const product = isProductExists[0];
      const newQty = product.cartItem.quantity + 1;
      // updating the relationship with updated into
      await cart.addProduct(product, {
        through: { quantity: newQty },
      });
      res.redirect("/cart");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postRemoveFromCart = async (req, res, next) => {
  const { id, qty } = req.body;
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: id } });
    const product = products[0];
    const newQty = product.cartItem.quantity - Number(qty);
    if (newQty < 1) {
      // removing relationship
      await product.cartItem.destroy();
    } else {
      // updating quantity in cartItem table
      await cart.addProduct(product, { through: { quantity: newQty } });
    }
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    res.redirect("/");
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    // we are use addProducts() method to add multiple entries and we pass a arry of product as parameter
    await order.addProducts(
      products.map((item) => {
        item.orderItem = { quantity: item.cartItem.quantity };
        return item;
      })
    );
    // here we can empty the cart
    await cart.setProducts(null);
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.getOrders = async (req, res, next) => {
  // providing include option will fetch related table data
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    console.log(orders);
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
