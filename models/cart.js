const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data", "cart.json");

class Cart {
  static addProduct = (id, productPrice) => {
    return new Promise((resolve, reject) => {
      const price = Number(productPrice);
      let cart = { products: [], totalPrice: 0, totalQty: 0 };
      //reading cart if already exists
      fs.readFile(filePath, (err, data) => {
        if (!err) {
          // if file is empty, there is data but causes error during parsing, so put it inside try catch block
          try {
            cart = JSON.parse(data);
          } catch (err) {
            console.log(err);
          }
        }

        // if product already exists, will increase qty
        let products = cart.products;
        for (let item of products) {
          if (item.id === id) {
            const newQty = item.qty + 1;
            item.qty = newQty;
          }
        }

        // if the product does not exit in the array, we will add the new product to it
        if (!products.find((item) => item.id === id)) {
          products.push({
            id: id,
            price: price,
            qty: 1,
          });
        }

        // updating totalPrice
        let updatedTotalPrice = 0;
        // updated total quantity
        let updatedTotalQty = 0;

        for (let item of products) {
          updatedTotalPrice =
            updatedTotalPrice + Number(item.price) * Number(item.qty);
          updatedTotalQty = updatedTotalQty + Number(item.qty);
        }
        const updatedCart = {
          products: products,
          totalPrice: updatedTotalPrice,
          totalQty: updatedTotalQty,
        };
        // writing back
        fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
          if (err) resolve(false);
          else resolve(true);
        });
      });
    });
  };
}

module.exports = Cart;
