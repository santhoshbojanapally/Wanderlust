const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const {
  validateUser,
  isOwner,
  saveRedirectUrl,
  checkConflict,
} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });

const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  // console.dir(result);
  if (result.error) {
    console.log("ERROR!!");
    next(new ExpressError(400, error.message));
  } else {
    next();
  }
};

// SHOW Route
router.get("/", WrapAsync(listingController.index));

router
  .route("/new")
  .get(validateUser, saveRedirectUrl, listingController.renderNewForm)
  .post(
    validateUser,
    validateListing,
    upload.single("listing[image]"),
    WrapAsync(listingController.createListing)
  );
router
  .route("/category/:c_id")
  .get(WrapAsync(listingController.showListingsByCategory));

router.route("/search").post(WrapAsync(listingController.showSearchResults));

router.route("/makePayment/:id").post(WrapAsync(listingController.makePayment));

router
  .route("/:id")
  .get(WrapAsync(listingController.showListing))
  .delete(validateUser, isOwner, WrapAsync(listingController.destroyListing));

router
  .route("/:id/edit")
  .get(validateUser, isOwner, WrapAsync(listingController.editListing))
  .put(
    validateUser,
    isOwner,
    upload.single("listing[image]"),
    WrapAsync(listingController.updateListing)
  );

router
  .route("/reserve/:id")
  .get(WrapAsync(listingController.renderReservationForm))
  .post(
    validateUser,
    checkConflict,
    WrapAsync(listingController.renderPaymentForm)
  );

module.exports = router;
