const sqzType = require("sequelize");
const db = require("../lib/database");
// OrderItem will have many to many relationship with Order
// OrderItem will have many to many relationship with Product as well
// It will work as intermediary for storing relationship between Order and Product
// In the end entries in orderItem will have an id, quantity, oderId, and productId  fields
const OrderItem = db.define("orderItem", {
  id: {
    type: sqzType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: sqzType.INTEGER,
});

module.exports = OrderItem;
