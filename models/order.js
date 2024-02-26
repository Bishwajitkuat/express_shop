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
  address: {
    name: {
      type: String,
      require: true,
    },
    street_address: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    postal_code: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    note: {
      type: String,
      require: true,
    },
  },
});

module.exports = mongoose.model("Order", OrderSchema);
