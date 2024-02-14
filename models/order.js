const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: [
    {
      title: {
        type: String,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
  ],
  totalQuantity: {
    type: Number,
    require: true,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  // delivery address and billing address can be added
});

module.exports = mongoose.model("Order", OrderSchema);
