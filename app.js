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
// // livereload
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
const { mongoConnect } = require("./lib/database");
const User = require("./models/user");
// importing models created with sequelize to create on to many relationship
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cartItem");
// const Order = require("./models/order");
// const OderItem = require("./models/orderItem");
// const OrderItem = require("./models/orderItem");

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
  // const newUser = new User("Bisso", "bisso@gmail.com");
  // newUser
  //   .save()
  //   .then((response) => console.log(response))
  //   .catch((err) => console.log(err));
  User.getUserByEmail("bisso@gmail.com")
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
// User.hasMany(Product);
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// creating one to one relationship between User and Cart
// User.hasOne(Cart);
// Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// creating many to many relationships among Cart and Product
// CartItem will be intermediary to store the relationships along with quantity information
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// creating one to many relationships between Order and User
// Order.belongsTo(User);
// User.hasMany(Order);
// creating many to many relationships between Order and Product
// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

// sysnc the data base before starting the app
// if we want to overwrite old database with new configaration (relationship)
// NOTE: we have to pass a condition {force: true} into sync() method.
// AFTER sync in , we have to remove the condition, otherwise it will erase db and rewrite

mongoConnect()
  .then(() => {
    app.listen(3000, () => console.log("listening at port 3000"));
  })
  .catch((err) => console.log(err));
