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
    this.id = Math.random().toString();
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

  static updateProduct(updatedProduct) {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(productsFile, (err, data) => {
          // as we are updating, so I am assuming the file and data is already existed
          const products = JSON.parse(data);
          // finding the index of the product, I am assuming index already existed
          const updateIndex = products.findIndex(
            (item) => item.id === updatedProduct.id
          );
          products[updateIndex] = updatedProduct;
          // // writing back to file
          fs.writeFile(productsFile, JSON.stringify(products), (err) =>
            resolve("failed")
          );
          resolve("success");
        });
      } catch (err) {
        console.log(err);
        reject("failed");
      }
    });
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
      fs.readFile(productsFile, (err, data) => {
        try {
          const products = JSON.parse(data);
          resolve(products);
        } catch (err) {
          console.log(err);
          resolve(false);
        }
      });
    });
  }

  static getProductById(id) {
    return new Promise((resolve, reject) => {
      fs.readFile(productsFile, (err, data) => {
        try {
          const allProducts = JSON.parse(data);
          const foundProduct = allProducts.find((item) => item.id == id);
          if (foundProduct) resolve(foundProduct);
          else resolve(false);
        } catch (err) {
          resolve(false);
        }
      });
    });
  }
}

module.exports = Product;
