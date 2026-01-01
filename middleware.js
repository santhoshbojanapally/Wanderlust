const Booking = require("./models/booking");
const Listing = require("./models/listing");
const Review = require("./models/reviews");

const validateUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to perform the action!");
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
  // console.log("URL: ", URL);
  // console.log(
  //   "review author: ",
  //   review.author._id,
  //   " , ",
  //   "locals CurrUser: ",
  //   res.locals.CurrUser
  // );
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

const checkConflict = async (req, res, next) => {
  let { id } = req.params;
  let { reservation } = req.body;
  // console.log(id);
  let listing = await Listing.findById(id);
  // console.log("Fetched from conflict: ", listing);
  let conflict1 = await Booking.find({
    listingId: id,
    checkIn: { $lte: reservation.checkIn },
    checkOut: { $gte: reservation.checkOut },
  });
  let conflict2 = await Booking.find({
    listingId: id,
    checkIn: { $gte: reservation.checkIn },
    checkOut: { $lte: reservation.checkOut },
  });
  let conflict3 = await Booking.find({
    listingId: id,
    checkIn: { $gte: reservation.checkIn, $lte: reservation.checkOut },
  });
  let conflict4 = await Booking.find({
    listingId: id,
    checkOut: { $gte: reservation.checkIn, $lte: reservation.checkOut },
  });
  // console.log("conflict: ", conflict1);
  if (
    conflict1.length ||
    conflict2.length ||
    conflict3.length ||
    conflict4.length
  ) {
    req.flash("error", "Your AirBnB is not available on the following dates!");
    return res.redirect(`/listings/reserve/${id}`);
  }
  next();
};

module.exports = {
  validateUser,
  saveRedirectUrl,
  isOwner,
  isReviewAuthor,
  checkConflict,
};
