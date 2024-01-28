const sqzType = require("sequelize");

const db = require("../lib/database");

// order will have one to one relationship with user
// but one to many relationship with orderItem
// in the end entires in order table will have id and userId fields
const Order = db.define("order", {
  id: {
    type: sqzType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
});

module.exports = Order;
