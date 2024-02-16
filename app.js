// importing express module
const express = require("express");
// importing body-parser module
const bodyParser = require("body-parser");
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

// livereload
const liveReload = require("livereload");
const liverReloadServer = liveReload.createServer();
liverReloadServer.watch(path.join(__dirname));
liverReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liverReloadServer.refresh("/");
  }, 100);
});

const connectLiveReload = require("connect-livereload");
// importing mongoose
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/user");

// creating app
const app = express();

//registering connectliveReload
app.use(connectLiveReload());
// registering ejs templeting engine
app.set("view engine", "ejs");
// registering default view dir
app.set("views", path.join(__dirname, "views"));

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

// middleware
// by default browser can not access to any sestem file, with express.static() method we need to allow which file is accessiable to public.
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

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
  .then((response) => {
    // creating and saving user in db for test
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "bisso",
          email: "bisso@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000, () => console.log("listening at port 3000"));
  })
  .catch((err) => console.log(err));
