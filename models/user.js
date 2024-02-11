const db = require("../lib/database").getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  async save() {
    return await db().collection("users").insertOne(this);
  }
  static async getUserByEmail(email) {
    return await db().collection("users").find({ email: email }).next();
  }
}

module.exports = User;
