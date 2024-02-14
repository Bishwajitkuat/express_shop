const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
  },
});

// adding utility method to instances created from User model, arrow function does not work here
UserSchema.methods.addToCart = function (productId) {
  // whether the product already existed in the items array, if does not exist productIndex value will be -1
  const productIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );
  let updatedItem = {};
  if (productIndex === -1) {
    // this product does not exist in the items array, so adding productId and quantity values
    updatedItem.productId = productId;
    updatedItem.quantity = 1;
    this.cart.items.push(updatedItem);
  } else {
    // the product already existed in the items array so only updating the quantity
    updatedItem = this.cart.items[productIndex];
    updatedItem.quantity += 1;
    // replacing the old itme with updated item
    this.cart.items.splice(productIndex, updatedItem);
  }
  // saving back to the db.
  return this.save();
};

UserSchema.methods.removeFromCart = function (productId, qty) {
  // whether the product already existed in the items array, if does not exist productIndex value will be -1
  const productIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );
  // if the product id does not exist in the items array, removing will not continue
  if (productIndex === -1) throw new Error("Product does not exist in cart!");
  const updatedProduct = this.cart.items[productIndex];
  // qty comes from input field so, needed to be converted to number
  updatedProduct.quantity = updatedProduct.quantity - Number(qty);

  if (updatedProduct.quantity < 1) {
    // remove from items array if new quantity is less than 1
    this.cart.items.splice(productIndex, 1);
  } else {
    // replacing object having old qty with updated object having updated qty
    this.cart.items.splice(productIndex, updatedProduct);
  }
  // saving back to the db.
  return this.save();
};

// utinity method to clear cart object of a user.
UserSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
