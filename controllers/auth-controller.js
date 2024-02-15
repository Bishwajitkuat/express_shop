// controllers for handling get request to login page
exports.getLogin = (req, res, next) => {
  res.render("./auth/login.ejs", { docTitle: "Login", path: "/login" });
};
