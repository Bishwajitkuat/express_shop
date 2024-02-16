// when request goes through this controller, it will fillter traffice on the basis of login status.
// if current user's session has isLoggedIn=ture and userId, it will pass the request to the next controller,
// otherwise redirected to /login route.
exports.isLoggedIn = (req, res, next) => {
  // if current user is not logged in or does not have userId in session, user will be redirected to /login route
  if (!req.session.isLoggedIn || !req.session.userId) {
    return res.redirect("/login");
  }
  // if current user will be passe into next controller
  next();
};
