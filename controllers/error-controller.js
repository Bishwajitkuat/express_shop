exports.get404 = (req, res, next) => {
  // response in ejs templeting engine
  res.status(404).render("./404.ejs", { docTitle: "404 | page not found" });
};
