const express = require("express");
const router = express.Router({ mergeParams:true });
const WrapAsync = require("../utils/WrapAsync.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");



const reviewValidate = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        next(new ExpressError(400, result.err.message));
    }
    else next();
}


// Review Routes

// POST route for reviews
router.post("/reviews", reviewValidate, WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let { review } = req.body;
    let newReview = new Review(review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${id}`);
}));


// DELETE Review Route

router.delete("/review/:rid", WrapAsync(async (req, res, next) => {
    let { id, rid } = req.params;
    await Review.findByIdAndDelete(rid);
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews:rid}});
    await listing.save();
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;