require("dotenv").config();
console.log(process.env.SECRET);

const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const reviewController = require("../controllers/reviews.js");

const {
  validateUser,
  isReviewAuthor,
  saveRedirectUrl,
} = require("../middleware.js");

const reviewValidate = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    console.log(result.error);
    next(new ExpressError(400, result.err.message));
  } else next();
};

// Review Routes

// POST route for reviews
router.post(
  "/reviews",
  validateUser,
  reviewValidate,
  WrapAsync(reviewController.createReview)
);

// DELETE Review Route

router.delete(
  "/review/:rid",
  validateUser,
  saveRedirectUrl,
  isReviewAuthor,
  WrapAsync(reviewController.destroyReview)
);

module.exports = router;
