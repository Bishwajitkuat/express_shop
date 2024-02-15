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
  try {
    const userId = "65cbbc1a91b53d07c1babcd4";
    // setting session's isLoggedIn key
    req.session.isLoggedIn = true;
    // setting session's userId
    req.session.userId = userId;
  } catch {
    (err) => console.log(err);
  }
  res.redirect("/");
};

// handles POST request to /logout route, user session will be destored, thus user will be logged out and redirected to home page.
exports.postLogOut = (req, res, next) => {
  // calling destroy method on session will removed the session from db.
  req.session.destroy(() => {
    res.redirect("/");
  });
};
