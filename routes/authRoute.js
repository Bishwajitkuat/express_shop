const express = require("express");
const {
  getLogin,
  postLogin,
  postLogOut,
} = require("../controllers/auth-controller");

const router = express.Router();
// get login page
router.get("/login", getLogin);
// post /login route
router.post("/login", postLogin);
// post /logout
router.post("/logout", postLogOut);
module.exports = router;
