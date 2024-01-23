// importing express module
const express = require("express");
// importing body-parser module
const bodyParser = require("body-parser");
// importing path module for node
const path = require("path");
// importing admin routes
const adminRoute = require("./routes/adminRoute");
// importing shop routes
const shopRoute = require("./routes/shopRoute");
const { get404 } = require("./controllers/error-controller");
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
// importing db
const sequelize = require("./lib/database");
// importing models created with sequelize to create on to many relationship
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");

// creating app
const app = express();

//registering connectliveReload
app.use(connectLiveReload());
// registering ejs templeting engine
app.set("view engine", "ejs");
// registering default view dir
app.set("views", path.join(__dirname, "views"));

// middleware
// by default browser can not access to any sestem file, with express.static() method we need to allow which file is accessiable to public.
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

// middleware to fetch the user with id 1 and attach to request object
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// admin route
app.use("/admin", adminRoute);
// shop route
app.use(shopRoute);
// 404 response
app.use(get404);

// creating one to many relationship User to
// onDelete: 'CASCADE' => deletion of User will delete User's Product
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// creating one to one relationship between User and Cart
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// sysnc the data base before starting the app
// if we want to overwrite old database with new configaration (relationship)
// NOTE: we have to pass a condition {force: true} into sync() method.
// AFTER sync in , we have to remove the condition, otherwise it will erase db and rewrite
sequelize
  .sync({ force: true })
  .then((response) => {
    app.listen(3000, () => console.log("listening at port 3000"));
  })
  .catch((err) => console.log(err));
