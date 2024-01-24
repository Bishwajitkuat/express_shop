"use strict";
const Sequelize = require("sequelize");

const db = new Sequelize("express_shop_DB", "bisso", "pass", {
  host: "localhost",
  port: "3308",
  dialect: "mariadb",
});
module.exports = db;
