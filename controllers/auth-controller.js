const bcrypt = require("bcryptjs");
const User = require("../models/user");
// controller for handling GET request to /login route
exports.getLogin = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  // passing isLoggedIn value for conditional rendering in navbar.
  // req.flash() returns of array of strings, and only comsumed
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  res.render("./auth/login.ejs", {
    docTitle: "Login",
    path: "/login",
    isLoggedIn,
    errorMessage: errorMessage,
  });
};
// controller for handling POST request to /login route
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // find the user by email
    const user = await User.findOne({ email: email });
    // if no user is found with the email addres user will be redirected to login page
    if (!user) {
      req.flash("error", "Invalid email or password!");
      return res.redirect("/login");
    }
    // comparing passwords, NOTE: eventhough it suggeds there is not effect of await, but it does
    // without await it will return promised, and used will never be able to login.
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch === true) {
      // password is match, session is created for this user
      // setting session's isLoggedIn key
      req.session.isLoggedIn = true;
      // setting session's userId
      req.session.userId = user._id.toString();
      return res.redirect("/");
    }
    req.flash("error", "Invalid email or password!");
    return res.redirect("/login");
  } catch {
    (err) => console.log(err);
    req.flash("error", "There is some technical problem. Please try later!");
    res.redirect("/login");
  }
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
