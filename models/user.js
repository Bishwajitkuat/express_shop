const { ObjectId } = require("mongodb");

const db = require("../lib/database").getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
  }
  async save() {
    return await db().collection("users").insertOne(this);
  }
  static async getUserById(id) {
    return await db()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
  }
  static async getCart(userId) {
    // fetch cart object for the userId passed as parameter
    const user = await db().collection("users").findOne({ _id: userId });
    return user.cart;
  }
  static async updateCart(userId, updatedCart) {
    // update new cart into db.
    await db()
      .collection("users")
      .updateOne({ _id: userId }, { $set: { cart: updatedCart } });
  }
}

module.exports = User;
