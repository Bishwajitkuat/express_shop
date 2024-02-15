const { getIsLoggedInFromCooke } = require("../lib/cookie-extractor");

exports.get404 = (req, res, next) => {
  // using helper function to extract isLoggedIn cookie value
  const isLoggedIn = getIsLoggedInFromCooke(req.get("Cookie"));
  // response in ejs templeting engine
  res
    .status(404)
    .render("./404.ejs", {
      docTitle: "404 | page not found",
      path: false,
      isLoggedIn,
    });
};
