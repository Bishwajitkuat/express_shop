"use strict";
const { ObjectId } = require("mongodb");
const db = require("../lib/database").getDB;

class Product {
  constructor(title, price, imgUrl, description) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
  }
  async save() {
    // saving the new product into the products collection
    const response = await db().collection("products").insertOne(this);
    return response;
  }
  // featching all products from products collection by find method
  static async getAllProducts() {
    return await db().collection("products").find().toArray();
  }
  static async getProductById(productId) {
    // featching a single product by productId
    return await db()
      .collection("products")
      .find({ _id: new ObjectId(productId) })
      .next();
  }
  static async updateProduct(product) {
    // updating product
    return await db()
      .collection("products")
      .updateOne({ _id: new ObjectId(product.id) }, { $set: product });
  }
  static async deleteProductById(productId) {
    // deleting product from products collection
    return await db()
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });
  }
}

module.exports = Product;
