const bcrypt = require("bcryptjs");
const User = require("../models/user");
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

exports.getSignup = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("./auth/signup.ejs", {
    docTitle: "Signup",
    path: "/signup",
    isLoggedIn,
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // better validation and feedback will be implemented later.
    if (name && email && password && confirmPassword) {
      // checking if the email already exist, if so, will not make new user
      const isAlreadyExists = await User.findOne({ email: email });
      if (isAlreadyExists) return res.redirect("/signup");
      // creating hash password and it's asyn
      const hasPassword = await bcrypt.hash(password, 10);
      // creating new instance of User model
      const newUser = new User({
        name,
        email,
        password: hasPassword,
        cart: { items: [] },
      });
      // saving into db
      await newUser.save();
      return res.redirect("/login");
    }
    return res.redirect("/signup");
  } catch (err) {
    console.log(err);
    res.redirect("signup");
  }
};
