const User = require("../models/user");

const getCartFromUserId = async (userId) => {
  // fetching the user, userId is extracted from session.userId
  const user = await User.findById(userId);
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
  return cart;
};

module.exports = { getCartFromUserId };
