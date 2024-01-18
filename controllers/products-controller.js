const products = [
  { title: "Book", price: "15" },
  { title: "Mobile", price: "150" },
];

exports.getAddProduct = (req, res, next) => {
  // sending response form ejs templeting engine
  res.render("./add-product.ejs", { docTitle: "Add Product" });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  res.redirect("/admin/add-product");
};

exports.getProducts = (req, res, next) => {
  // sending response through ejs templeting engine
  res.render("./shop.ejs", { products, docTitle: "Shop" });
};
