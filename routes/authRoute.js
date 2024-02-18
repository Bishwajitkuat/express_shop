const express = require("express");
const {
  getLogin,
  postLogin,
  postLogOut,
  getSignup,
  postSignup,
  getResetPassword,
} = require("../controllers/auth-controller");

const router = express.Router();
// get login page
router.get("/login", getLogin);
// post /login route
router.post("/login", postLogin);
// post /logout
router.post("/logout", postLogOut);
// get /signup
router.get("/signup", getSignup);
// post /signup
router.post("/signup", postSignup);
// get /reset-password
router.get("/reset-password", getResetPassword);
module.exports = router;
