// controller for handling GET request to /login route
exports.getLogin = (req, res, next) => {
  res.render("./auth/login.ejs", { docTitle: "Login", path: "/login" });
};
// controller for handling POST request to /login route
exports.postLogin = (req, res, next) => {
  // setting cookie with setHeader
  res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.redirect("/");
};
