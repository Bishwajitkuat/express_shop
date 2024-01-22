const fs = require("fs");
const path = require("path");
const productsFile = path.join(__dirname, "data", "products.json");
// importing db connection pool
const db = require("../lib/database");

class Product {
  constructor(title, imgUrl, description, price) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = Number(price);
  }

  save() {
    return db.execute(
      `INSERT INTO products (title, price, imgUrl, description) VALUES (?, ?, ?, ?);`,
      [this.title, this.price, this.imgUrl, this.description]
    );
  }

  static updateProduct(updatedProduct) {
    return db.execute(
      "UPDATE products SET title=?, price=?, imgUrl=?, description=? WHERE id=?;",
      [
        updatedProduct.title,
        Number(updatedProduct.price),
        updatedProduct.imgUrl,
        updatedProduct.description,
        updatedProduct.id,
      ]
    );
  }

  static deleteProduct(id) {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(productsFile, (err, data) => {
          const products = JSON.parse(data);

          // filtering out the product to be deleted
          const updatedProducts = products.filter((item) => item.id !== id);
          fs.writeFile(productsFile, JSON.stringify(updatedProducts), (err) => {
            console.log(err);
            resolve("failed");
          });
          resolve("success");
        });
      } catch (err) {
        console.log(err);
        resolve("failed");
      }
    });
  }

  static getAllProducts() {
    return new Promise((resolve, reject) => {
      db.execute("SELECT * FROM products;")
        .then((res) => resolve(res[0]))
        .catch((err) => resolve(false));
    });
  }

  static getProductById(id) {
    return new Promise((resolve, reject) => {
      db.execute(`SELECT * FROM products WHERE id=${id};`)
        .then((res) => resolve(res[0][0]))
        .catch((err) => resolve(false));
    });
  }
}

module.exports = Product;
