const Listing = require("./models/listing");
const Review = require("./models/reviews");

const validateUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to add a listing!");
    return res.redirect("/login");
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  let { id, rid } = req.params;
  let review = await Review.findById(rid);
  if (review.author._id.equals(res.locals.CurrUser._id)) {
    return next();
  }
  req.session.redirectUrl = req.originalUrl;
  let URL = req.session.redirectUrl;
  URL = URL.slice(0, URL.length - 15);
  URL = URL.slice(0, URL.length - 31);
  console.log("URL: ", URL);
  console.log(
    "review author: ",
    review.author._id,
    " , ",
    "locals CurrUser: ",
    res.locals.CurrUser
  );
  req.flash("error", "You are not the author of this review!");
  res.redirect(URL);
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let user = res.locals.CurrUser;
  if (listing && !listing.owner._id.equals(user._id)) {
    req.flash("error", "You are not the owner of this listing!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = { validateUser, saveRedirectUrl, isOwner, isReviewAuthor };
