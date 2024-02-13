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

module.exports = mongoose.model("User", UserSchema);
