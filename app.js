// importing express module
const express = require("express");
// importing body-parser module
const bodyParser = require("body-parser");
// importing path module for node
const path = require("path");
const rootDir = require("./lib/paths");
// importing admin routes
const adminRoute = require("./routes/adminRoute");
// importing shop routes
const shopRoute = require("./routes/shopRoute");
const { get404 } = require("./controllers/error-controller");

// creating app
const app = express();

// registering ejs templeting engine
app.set("view engine", "ejs");
// registering default view dir
app.set("views", "./views/ejs");

// middleware
// by default browser can not access to any sestem file, with express.static() method we need to allow which file is accessiable to public.
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
// admin route
app.use("/admin", adminRoute);
// shop route
app.use(shopRoute);
// 404 response
app.use(get404);
app.listen(3000, () => console.log("listening at port 3000"));
