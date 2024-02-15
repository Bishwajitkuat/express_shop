const { getIsLoggedInFromCooke } = require("../lib/cookie-extractor");

// controller for handling GET request to /login route
exports.getLogin = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  // passing isLoggedIn value for conditional rendering in navbar.
  res.render("./auth/login.ejs", {
    docTitle: "Login",
    path: "/login",
    isLoggedIn,
  });
};
// controller for handling POST request to /login route
exports.postLogin = (req, res, next) => {
  // setting session
  req.session.isLoggedIn = true;
  res.redirect("/");
};
