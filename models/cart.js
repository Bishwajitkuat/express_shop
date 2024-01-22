const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data", "cart.json");

class Cart {
  static getCart = () => {
    return new Promise((resolve, reject) => {
      let cart = { products: [], totalPrice: 0, totalQty: 0 };
      try {
        fs.readFile(filePath, (err, data) => {
          cart = JSON.parse(data);
          resolve(cart);
        });
      } catch (err) {
        resolve(cart);
      }
    });
  };
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
  // it can be remove qty one by one or all togather
  static removeProduct(id, quantity) {
    const qty = Number(quantity);
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(filePath, (err, data) => {
          let cart = JSON.parse(data);
          let updatedProducts = [...cart.products];

          const productToRemove = cart.products.find((item) => item.id === id);
          // removing the product from cart if the qty goes smaller than 1
          if (productToRemove.qty - qty < 1) {
            updatedProducts = cart.products.filter((item) => item.id !== id);
          }
          // if the qty after substraction remain grater than 0, qty will reduce by 1
          else if (qty === 1 && productToRemove.qty - qty > 0) {
            updatedProducts = updatedProducts.reduce((acc, item) => {
              if (item.id === id) {
                const newQty = item.qty - 1;
                item.qty = newQty;
                // acc.push(item);
                return [...acc, item];
              }
              return [...acc, item];
            }, []);
          }
          // updating cart info after change
          // updating totalPrice
          let updatedTotalPrice = 0;
          // updated total quantity
          let updatedTotalQty = 0;

          for (let item of updatedProducts) {
            updatedTotalPrice =
              updatedTotalPrice + Number(item.price) * Number(item.qty);
            updatedTotalQty = updatedTotalQty + Number(item.qty);
          }
          const updatedCart = {
            products: updatedProducts,
            totalPrice: updatedTotalPrice,
            totalQty: updatedTotalQty,
          };
          // writing back
          fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
            if (err) resolve("failed");
            else resolve("success");
          });
        });
      } catch (err) {
        console.log(err);
        resolve("failed");
      }
    });
  }
}

module.exports = Cart;
