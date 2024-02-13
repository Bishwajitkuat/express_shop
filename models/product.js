"use strict";
const mongoose = require("mongoose");

// creating schema from Schema method of mongoose
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imgUrl: {
    type: String,
    require: true,
  },
});

// creating Product model from model method of mongoose
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
