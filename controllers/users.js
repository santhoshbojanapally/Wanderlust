const User = require("../models/user.js");

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (e) => {
      if (e) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust, You are Signed up!!");
      res.redirect("/listings");
    });
  } catch (e) {
    // console.log(e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render("users/login.ejs");
  }
  return res.redirect("/listings");
};

module.exports.rendersignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.login = async (req, res, next) => {
  req.flash(
    "success",
    "Welcome to Wanderlust, You have successfully logged in!!"
  );
  let redirectedUrl = res.locals.redirectUrl || "/listings";
  // console.log(res.locals.redirectUrl);
  res.redirect(redirectedUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) next(err);
    else {
      req.flash("success", "You are logged out!!");
      res.redirect("/listings");
    }
  });
};

module.exports.renderUsernameForm = (req, res, next) => {
  res.render("users/changeUserName.ejs");
};

module.exports.renderEmailForm = (req, res, next) => {
  res.render("users/changeEmail.ejs");
};

module.exports.updateEmail = async (req, res, next) => {
  let { id } = req.params;
  let { user } = req.body;
  // console.log("From update Email: ", id);
  await User.findByIdAndUpdate(
    id,
    {
      username: user.username,
      email: user.email,
    },
    { runValidators: true, new: true }
  );
  req.flash("success", "Email is updated successfully!");
  res.redirect("/listings");
};

module.exports.updateUserName = async (req, res, next) => {
  let { id } = req.params;
  let { user } = req.body;
  // console.log("From update Email: ", id);
  await User.findByIdAndUpdate(
    id,
    {
      username: user.username,
      email: user.email,
    },
    { runValidators: true }
  );
  req.flash("success", "Username is updated successfully!");
  res.redirect("/listings");
};
