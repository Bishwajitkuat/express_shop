const express = require("express");
const { getLogin, postLogin } = require("../controllers/auth-controller");

const router = express.Router();
// get login page
router.get("/login", getLogin);
// post /login route
router.post("/login", postLogin);
module.exports = router;
