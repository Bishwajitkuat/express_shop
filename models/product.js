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
    return db.execute("DELETE FROM products WHERE id=?;", [id]);
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
