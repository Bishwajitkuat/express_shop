const express = require("express");
const { getLogin } = require("../controllers/auth-controller");

const router = express.Router();
// get login page
router.get("/login", getLogin);
module.exports = router;
