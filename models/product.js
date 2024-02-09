"use strict";
const db = require("../lib/database").getDB;

class Product {
  constructor(title, price, imgUrl, description) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
  }
  async save() {
    const response = await db().collection("products").insertOne(this);
    return response;
  }
}

module.exports = Product;
