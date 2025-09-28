const express=require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync=require("../utils/WrapAsync.js")
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../Schema.js");


const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.dir(result);
    if (result.error) {
        console.log("ERROR!!");
        next(new ExpressError(400, error.message));
    }
    else {
        next();
    }
}

// SHOW Route
router.get("/", WrapAsync(async (req, res, next) => {
    let data = await Listing.find({}); //fetches every document from Listing collection in DB. 
    res.render("listings/index.ejs", { data }); //passes it to index.ejs for rendering
}));

// NEW Route
router.get("/new", (req, res) => {
    res.render("listings/newForm.ejs"); //For creating new Listing, we collect details of the listing.
});

// Individual SHOW Route
router.get("/:id", WrapAsync(async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");//for viewing a listing individually we find it using id and populate the reviews.
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!");
        return res.redirect("/listings");
    }
    return res.render("listings/listing.ejs", { listing }); // render the listing
}));

// Form for new Listing
router.post("/new", validateListing, WrapAsync(async (req, res, next) => {
    let { listing } = req.body;
    let newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New listing created Successfully!!");
    res.redirect("/listings");
}));


// Edit route
router.get("/:id/edit", WrapAsync(async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findOne({ _id: id });
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/Edit.ejs", { listing });
}));

// UPDATE route
router.put("/:id/edit", WrapAsync(async (req, res, next) => {
    let { listing } = req.body;
    let { id } = req.params;
    let changedListing = await Listing.updateOne({ _id: id }, { title: listing.title, description: listing.description, price: listing.price, location: listing.location, country: listing.country }, { runValidators: true, new: true });
    if (!changedListing) {
        throw new ExpressError(400, "Please send valid Data");
    }
    req.flash("success", "Listing Updated!!");
    res.redirect("/listings");
}));

// DELETE Route
router.delete("/:id", WrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
}));

module.exports = router;