// importing express module
const express = require("express");

// importing body-parser module
const bodyParser = require("body-parser");

// importing path module for node
const path = require("path");

const rootDir = require("./lib/paths");

// importing admin routes
const { adminRoute } = require("./routes/adminRoute");

// importing shop routes
const shopRoute = require("./routes/shopRoute");

// creating app
const app = express();

// setting templating which templating engin we are going to use.
app.set("view engine", "pug");
// setting which dir will be used for views, here, views dir will be used as views
app.set("views", "views/pug");

// middleware
// by default browser can not access to any sestem file, with express.static() method we need to allow which file is accessiable to public.
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
// admin route
app.use("/admin", adminRoute);
// shop route
app.use(shopRoute);
// 404 response
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});
app.listen(3000, () => console.log("listening at port 3000"));
