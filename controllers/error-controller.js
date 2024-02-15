const { getIsLoggedInFromCooke } = require("../lib/cookie-extractor");

exports.get404 = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  // response in ejs templeting engine
  res.status(404).render("./404.ejs", {
    docTitle: "404 | page not found",
    path: false,
    isLoggedIn,
  });
};
