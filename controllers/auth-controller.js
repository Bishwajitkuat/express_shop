const { getIsLoggedInFromCooke } = require("../lib/cookie-extractor");

// controller for handling GET request to /login route
exports.getLogin = (req, res, next) => {
  // using helper function to extract isLoggedIn cookie value
  const isLoggedIn = getIsLoggedInFromCooke(req.get("Cookie"));
  // passing isLoggedIn value for conditional rendering in navbar.
  res.render("./auth/login.ejs", {
    docTitle: "Login",
    path: "/login",
    isLoggedIn,
  });
};
// controller for handling POST request to /login route
exports.postLogin = (req, res, next) => {
  // setting cookie with setHeader
  res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.redirect("/");
};
