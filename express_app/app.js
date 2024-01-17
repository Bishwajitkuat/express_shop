// importing express module
const express = require("express");

// importing body-parser module
const bodyParser = require("body-parser");

// importing admin routes
const adminRoute = require("./routes/adminRoute");

// importing shop routes
const shopRoute = require("./routes/shopRoute");

// creating app
const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
// admin route
app.use(adminRoute);
// shop route
app.use(shopRoute);
// creating server which will listening to port
app.listen(3000, () => console.log("listening at port 3000"));
