// importing express module
const express = require("express");
// importing body-parser module
const bodyParser = require("body-parser");
const multer = require("multer");
// importing path module for node
const path = require("path");
// importing admin routesmajority
const adminRoute = require("./routes/adminRoute");
// importing shop routes
const shopRoute = require("./routes/shopRoute");
// importing auth routes
const authRoute = require("./routes/authRoute");
const { get404 } = require("./controllers/error-controller");
// importing session
const session = require("express-session");
// importing MongoDBStore class
const MongoDBStore = require("connect-mongo");
// importing connect-flash package
const flash = require("connect-flash");

// importing mongoose
const mongoose = require("mongoose");
require("dotenv").config();
// importing csurf
const csrf = require("csurf");
// configuring csrfProtection middleware
const csrfProtection = csrf();
const User = require("./models/user");
const { storage } = require("./lib/multer/multer-storage");

// creating app
const app = express();

// registering ejs templeting engine
app.set("view engine", "ejs");
// registering default view dir
app.set("views", path.join(__dirname, "views"));

// by default browser can not access to any sestem file, with express.static() method we need to allow which file is accessiable to public.

app.use(express.static(path.join(__dirname, "public")));
// for serving static images
app.use("/image", express.static(path.join(__dirname, "image")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage }).single("image"));
// middleware
// middleware to configure session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    // mongodb session storage
    store: MongoDBStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ttv2qxt.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
      // collection name will be adjuctly what  we will pass, mongodb will not make it plural
      collectionName: "sessions",
    }),
  })
);
// csrfProtection middleware, NOTE csrfProtection middleware should be after bodyParser and session middleware
app.use(csrfProtection);
// middleware to send data to all view bypassing the controllers
app.use((req, res, next) => {
  // csrfToken value will be accessible from all views.
  res.locals.csrfToken = req.csrfToken();
  next();
});
// adding flash middleware
app.use(flash());

// admin route
app.use("/admin", adminRoute);
// shop route
app.use(shopRoute);
// registering auth route
app.use(authRoute);
// 404 response
app.use(get404);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ttv2qxt.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`
  )
  .then((response) =>
    app.listen(3000, () => console.log("listening at port 3000"))
  )
  .catch((err) => console.log(err));
