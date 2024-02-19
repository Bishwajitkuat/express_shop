const bcrypt = require("bcryptjs");
const { z } = require("zod");
const {
  LoginInputSchema,
  SignupInputSchema,
} = require("../lib/zod-validation/validation-schemas");
const crypto = require("crypto");
const User = require("../models/user");
const {
  transporter,
  signupMailOptions,
  resetPasswordMailOptions,
} = require("../lib/nodemailer");

// controller for handling GET request to /login route
exports.getLogin = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  // passing isLoggedIn value for conditional rendering in navbar.
  // req.flash() returns of array of strings, and only comsumed
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  res.render("./auth/login.ejs", {
    docTitle: "Login",
    path: "/login",
    isLoggedIn,
    errorMessage,
    successMessage,
    errors: null,
    oldValues: null,
  });
};

// controller for handling POST request to /login route
exports.postLogin = async (req, res, next) => {
  try {
    // validatio with zod
    const validation = LoginInputSchema.safeParse(req.body);
    // if validation fails
    if (validation.success === false) {
      const error = validation.error.flatten().fieldErrors;
      // error object will be used to show feedback in view
      const errors = {
        email: error?.email ? error?.email[0] : false,
        password: error?.password ? error?.password[0] : false,
      };
      // view's input fields will be prefield with the old values
      const oldValues = {
        email: req.body.email,
        password: req.body.password,
      };
      // rendering login view with feedbacks
      return res.render("./auth/login", {
        docTitle: "Login",
        path: "/login",
        isLoggedIn: false,
        errorMessage: null,
        successMessage: null,
        errors,
        oldValues,
      });
    }
    // validation is successfull, extracting data
    const { email, password } = validation.data;
    // find the user by email
    const user = await User.findOne({ email: email });
    // if no user is found with the email addres user will be taken to login page with feedbacks
    if (!user) {
      return res.render("./auth/login", {
        docTitle: "Login",
        path: "/login",
        isLoggedIn: false,
        errorMessage: "Invalid email or password!",
        successMessage: null,
        errors: null,
        oldValues: validation.data,
      });
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
    // password did not match, user will taken to login page with feedback
    return res.render("./auth/login", {
      docTitle: "Login",
      path: "/login",
      isLoggedIn: false,
      errorMessage: "Invalid email or password!",
      successMessage: null,
      errors: null,
      oldValues: validation.data,
    });
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
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  const isLoggedIn = req.session.isLoggedIn;
  res.render("./auth/signup.ejs", {
    docTitle: "Signup",
    path: "/signup",
    isLoggedIn: false,
    errorMessage: null,
    successMessage: null,
    errors: null,
    oldValues: null,
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    // zod validation
    const validation = SignupInputSchema.safeParse(req.body);
    // if validation fails
    if (validation.success === false) {
      const error = validation.error.flatten().fieldErrors;
      // error object will be used to show feedback in view
      const errors = {
        name: error?.name ? error?.name[0] : false,
        email: error?.email ? error?.email[0] : false,
        password: error?.password ? error?.password[0] : false,
        confirmPassword: error?.confirmPassword
          ? error?.confirmPassword[0]
          : false,
      };
      // view's input fields will be prefield with the old values
      const oldValues = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      };
      // rendering login view with feedbacks
      return res.render("./auth/signup", {
        docTitle: "Signup",
        path: "/signup",
        isLoggedIn: false,
        errorMessage: null,
        successMessage: null,
        errors,
        oldValues,
      });
    }
    // validation is successfull, extracting data
    const { name, email, password, confirmPassword } = validation.data;
    // checking whether there is user with the email address
    const isAlreadyExists = await User.findOne({ email: email });
    // if user already exist with the email, render signup view with feedback and prefilled input fields
    if (isAlreadyExists) {
      return res.render("./auth/signup", {
        docTitle: "Signup",
        path: "/signup",
        isLoggedIn: false,
        errorMessage: `There is already a user with this email address!`,
        successMessage: null,
        errors: null,
        oldValues: validation.data,
      });
    }
    // creating hash password and it's asyn
    const hashPassword = await bcrypt.hash(password, 10);
    // creating new instance of User model
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      cart: { items: [] },
    });
    // saving into db
    await newUser.save();
    await transporter.sendMail(signupMailOptions(name, email), (err, info) => {
      if (err) console.log(err);
    });
    // sending feedback for successful account creation
    req.flash("success", "You have successfully created your account!");
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    // rendering signup view with generalized error message and prefilled input fields
    return res.render("./auth/signup", {
      docTitle: "Signup",
      path: "/signup",
      isLoggedIn: false,
      errorMessage: `There is some technical problem creating your account, please try again later!`,
      successMessage: null,
      errors: null,
      oldValues: req.body,
    });
  }
};

// handles get requests to /reset-password
exports.getResetPassword = (req, res, next) => {
  // extracting isLoggedIn value from session
  const isLoggedIn = req.session.isLoggedIn;
  // req.flash() returns of array of strings, and only comsumed
  const error = req.flash("error");
  const errorMessage = error.length < 1 ? null : error;
  const success = req.flash("success");
  const successMessage = success.length < 1 ? null : success;
  res.render("./auth/reset-password.ejs", {
    docTitle: "Reset password",
    path: "/reset-password",
    isLoggedIn,
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
};
// handles post request to /reset-password
exports.postResetPassword = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ email: req.body.email });
    // if ther is no user with this email, sends an error message.
    if (!user) {
      req.flash("error", "There is no user with this email! Please signup!");
      return res.redirect("/reset-password");
    }
    // assigning token and expiration date to the user
    user.passwordResetToken = token;
    user.resetTokenExpiration = Date.now() + 300000;
    await user.save();
    const url = `${process.env.BASE_URL}/set-new-password`;
    // sending password resetting email
    transporter.sendMail(
      resetPasswordMailOptions(user.name, user.email, token, url),
      (err, info) => {
        if (err) console.log(err);
      }
    );
    req.flash(
      "success",
      "An email has been sent. Please follow the insctructions in the email!"
    );
    res.redirect("/reset-password");
  } catch (err) {
    console.log(err);
    req.flash(
      "error",
      "There are some technical error, please try again later!"
    );
    res.redirect("/reset-password");
  }
};

exports.getSetNewPassword = async (req, res, next) => {
  try {
    const error = req.flash("error");
    const errorMessage = error.length < 1 ? null : error;
    const allow = req.flash("allowResetting");
    // this will be used for conditional rendering of passwor and confirm password fields in view
    const allowResetting = allow.length < 1 ? true : allow[0];
    const token = req.params.token;
    const user = await User.findOne({
      passwordResetToken: token,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });
    // if no users are available, error feebcack will be given instead of password reset form
    if (!user) {
      console.log(user);
      return res.render("./auth/set-new-password.ejs", {
        docTitle: "Set new passowrd",
        path: "/set-new-password",
        isLoggedIn: false,
        errorMessage: "Invalid operation or token",
        allowResetting: false,
        token,
      });
    }
    // user will be given be given to input form for resetting password.
    const isLoggedIn = req.session.isLoggedIn;
    return res.render("./auth/set-new-password", {
      docTitle: "Set new passowrd",
      path: "/set-new-password",
      isLoggedIn,
      errorMessage: errorMessage,
      allowResetting: allowResetting,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.render("./auth/set-new-password.ejs", {
      docTitle: "Set new passowrd",
      path: "/set-new-password",
      isLoggedIn: false,
      errorMessage: "Invalid operation or token",
      allowResetting: false,
      token,
    });
  }
};

exports.postSetNewPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword, token } = req.body;
    // user will be given feedback and password resetting form
    if (!password || !confirmPassword || !token) {
      req.flash("error", "One or more fields are missing!");
      req.flash("allowResetting", true);
      return res.redirect(`/set-new-password/${token}`);
    }
    // user will be given feedback and password resetting form
    if (password !== confirmPassword) {
      req.flash("error", "Password and Confirm password does not match!");
      req.flash("allowResetting", true);
      return res.redirect(`/set-new-password/${token}`);
    }
    // fetching the user, checki tokenExpirary time, hash password, save new password, deleter token and
    const user = await User.findOne({
      passwordResetToken: token,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });
    // if user does not exists or token has already expired.
    // user will be given feedback and but password resetting form will not be rendered
    if (!user) {
      req.flash("error", "Invalid operation or token!");
      req.flash("allowResetting", false);
      return res.redirect("/set-new-password/error");
    }
    // hasing the new password
    const newHashPassword = await bcrypt.hash(password, 10);
    user.password = newHashPassword;
    // resetting properties, so that same token can not be used again.
    user.passwordResetToken = undefined;
    user.resetTokenExpiration = undefined;
    // saving back into db.
    await user.save();
    // redirected to /login route with success feedback
    req.flash(
      "success",
      "Congratulations! You have successfully changed your password!"
    );
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    req.flash("error", "Invalid operation or token!");
    req.flash("allowResetting", false);
    return res.redirect("/set-new-password/error");
  }
};
