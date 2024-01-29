"use strict";
const sqzType = require("sequelize");
const db = require("../lib/database");

// creating schema for Product, define methods takes first argument as table name and object as second argument
// the object's property name is the field name of the table
// each property holds an object which contains various charectaristics of the fileds
const Product = db.define("product", {
  id: {
    type: sqzType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: sqzType.STRING,
    allowNull: false,
  },
  price: {
    type: sqzType.DOUBLE,
    allowNull: false,
  },
  imgUrl: {
    type: sqzType.STRING,
    allowNull: false,
  },
  description: {
    type: sqzType.STRING,
    allowNull: false,
  },
});

module.exports = Product;
