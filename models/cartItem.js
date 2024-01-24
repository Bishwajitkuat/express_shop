const sqzType = require("sequelize");
const db = require("../lib/database");
// CartItem will have many to many relationship with Cart
// CartItem will have many to many relationship with Product as well
// It will work as intermediary for storing relationship between Cart and Product
// In the end entries in cartItem will have an id, quantity, cartId, and productId  fields
const CartItem = db.define("cartItem", {
  id: {
    type: sqzType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: sqzType.INTEGER,
});

module.exports = CartItem;
