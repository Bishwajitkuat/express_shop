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
  static async getAllProducts() {
    return await db().collection("products").find().toArray();
  }
}

module.exports = Product;
