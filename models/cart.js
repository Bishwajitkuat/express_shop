const sqzType = require("sequelize");

const db = require("../lib/database");

// cart will have one to one relationship with user
// but one to many relationship with cartItem
// in the end entires in cart table will have id and userId fields
const Cart = db.define("cart", {
  id: {
    type: sqzType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Cart;
