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

module.exports = mongoose.model("User", UserSchema);
