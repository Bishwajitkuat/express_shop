const { ObjectId } = require("mongodb");

const db = require("../lib/database").getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  async save() {
    return await db().collection("users").insertOne(this);
  }
  static async getUserById(id) {
    return await db()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
