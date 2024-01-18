export const products = [
  { title: "Book", price: "15" },
  { title: "Mobile", price: "150" },
];

export const getAddProduct = (req, res, next) => {
  // sending response form ejs templeting engine
  res.render("./add-product.ejs", { docTitle: "Add Product" });
};

export const postAddProduct = (req, res, next) => {
  console.log(req.body);
  res.redirect("/admin/add-product");
};
