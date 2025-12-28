const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let { review } = req.body;
  let newReview = new Review(review);
  console.log("From review.js: ", res.locals.CurrUser);
  newReview.author = res.locals.CurrUser;
  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "Review Added!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  let { id, rid } = req.params;
  console.log("from review.js: ", rid);
  await Review.findByIdAndDelete(rid);
  let listing = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: rid },
  });
  await listing.save();
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
