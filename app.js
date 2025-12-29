require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override"); // used to implement PUT, PATCH, DELETE which are not supported by html
const ejsMate = require("ejs-mate"); //used to efficiently implement layouts and includes
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const { MongoStore, createWebCryptoAdapter } = require("connect-mongo");
const ATLASDB_URL = process.env.ATLASDB_URL;

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cryptoAdapter: createWebCryptoAdapter({
    secret: process.env.SESSION_SECRET,
  }),
  store: MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600,
  }),
};

app.use(session(sessionOptions));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
  await mongoose.connect(ATLASDB_URL);
}

main()
  .then(() => {
    console.log("Connected!");
  })
  .catch(() => {
    console.log("Failed to connect!!");
  });

app.listen(8080, () => {
  console.log("App is listening on port 8080...");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrUser = req.user;
  console.log(req.user);
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id", reviewsRouter);
app.use("/", userRouter);

// Middleware to handle Errors!
app.use((err, req, res, next) => {
  const { status = 404, message = "Page Not found!" } = err;
  res.status(status).render("error.ejs", { message });
});
