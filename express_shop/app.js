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

// creating app
const app = express();

// middleware
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
