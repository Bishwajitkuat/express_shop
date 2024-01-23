const sqzType = require("sequelize");
const sequelize = require("../lib/database");

const User = sequelize.define("user", {
  id: {
    type: sqzType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: sqzType.STRING,
    allowNull: false,
  },
  email: {
    type: sqzType.STRING,
    allowNull: false,
  },
});

module.exports = User;
