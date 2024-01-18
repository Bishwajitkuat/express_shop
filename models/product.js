const products = [{ title: "Book" }, { title: "Mobile" }];

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  static getAllProducts() {
    return products;
  }
}

module.exports = Product;
