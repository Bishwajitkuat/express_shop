const fs = require("fs");
const path = require("path");
const productsFile = path.join(__dirname, "data", "products.json");
// const products = [{ title: "Book" }, { title: "Mobile" }];

class Product {
  constructor(title, imgUrl, description, price) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    fs.readFile(productsFile, (err, data) => {
      let products = [];
      // only read file if there is no error
      if (!err) {
        // reading data from file
        products = JSON.parse(data);
      }
      // appending new object
      products.push(this);
      // // writing back to file
      fs.writeFile(productsFile, JSON.stringify(products), (err) =>
        console.log(err)
      );
    });
  }

  static async getAllProducts() {
    try {
      const data = await fs.promises.readFile(productsFile, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }
}

module.exports = Product;
