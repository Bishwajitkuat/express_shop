const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  port: "3308",
  user: "bisso",
  database: "express_shop_DB",
  password: "pass",
});

module.exports = db.promise();
