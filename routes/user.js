const express = require("express");
const Router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

Router.route("/").get(userController.renderLoginForm);

Router.route("/signup")
  .get(userController.rendersignUpForm)
  .post(WrapAsync(userController.signUp));

Router.route("/login")
  .get(WrapAsync(userController.renderLoginForm))
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    WrapAsync(userController.login)
  );

Router.get("/logout", userController.logout);

Router.route("/changeUsername/:id")
  .get(userController.renderUsernameForm)
  .post(userController.updateUserName);

Router.route("/changeEmail/:id")
  .get(userController.renderEmailForm)
  .post(WrapAsync(userController.updateEmail));

module.exports = Router;
