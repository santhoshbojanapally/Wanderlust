const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const opencage = require("opencage-api-client");
var DateDiff = require("date-diff").default;

module.exports.index = async (req, res, next) => {
  let data = await Listing.find({});
  res.render("listings/index.ejs", { data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/newForm.ejs");
};

module.exports.showListingsByCategory = async (req, res, next) => {
  let { c_id } = req.params;
  let id = c_id;
  if (id === "Iconic") id = "Iconic cities";
  else if (id === "Amazing") id = "Amazing pools!";
  let data = await Listing.find({ category: `${id}` });
  // console.log(data);
  if (data.length > 0) {
    return res.render("listings/index.ejs", { data });
  }
  res.render("noListing.ejs");
};

module.exports.showSearchResults = async (req, res, next) => {
  console.log(req.body);
  let listings = await Listing.find({ title: req.body.query });
  for (listing of listings) console.log(listings);
  if (listings.length > 0) {
    return res.render("listings/index.ejs", { data: listings });
  }
  res.render("noListingFound.ejs");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  // console.log(id);
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }
  return res.render("listings/listing.ejs", {
    listing,
    currUser: res.locals.CurrUser,
  });
};

module.exports.createListing = async (req, res, next) => {
  let URL = req.file.path;
  let fileName = req.file.filename;
  // console.log("URL: ", URL, "\n", "FileName: ", fileName);
  let { listing } = req.body;
  console.log(listing);
  // console.log(listing);
  listing.image = { filename: fileName, url: URL };
  let newListing = new Listing(listing);
  newListing.owner = req.user._id;
  try {
    let location = newListing.location + " " + newListing.country;
    let response = await opencage.geocode({ q: `${location}` });
    let geometry = {
      type: "Point",
      coordinates: [
        `${response.results[0].geometry.lat}`,
        `${response.results[0].geometry.lng}`,
      ],
    };
    newListing.geometry = geometry;
  } catch (err) {
    console.log("Something broke on our side!!");
  }
  await newListing.save();
  req.flash("success", "New listing created Successfully!!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;
  // console.log("Edit listing requested");
  let listing = await Listing.findOne({ _id: id });
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist");
    return res.redirect("/listings");
  }
  let URL = listing.image.url;
  URL = URL.replace("upload/", `upload/w_250/`);
  // console.log(URL);
  res.render("listings/Edit.ejs", { listing, URL });
};

module.exports.updateListing = async (req, res, next) => {
  let { listing } = req.body;
  let { id } = req.params;
  let newLocation = listing.location + " " + listing.country;
  try {
    let response = await opencage.geocode({ q: `${newLocation}` });
    let geometry = {
      type: "Point",
      coordinates: [
        `${response.results[0].geometry.lat}`,
        `${response.results[0].geometry.lng}`,
      ],
    };
    listing.geometry = geometry;
  } catch (err) {
    console.log("Something broke on our side!!");
  }
  let changedListing = await Listing.findByIdAndUpdate(
    { _id: id },
    {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      geometry: listing.geometry,
      country: listing.country,
    },
    { runValidators: true, new: true }
  );

  if (typeof req.file !== "undefined") {
    changedListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    changedListing.save();
  }

  // console.log("listing from edit listing: ", listing);
  if (!changedListing) {
    throw new ExpressError(400, "Please send valid Data");
  }
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you are trying to delete does not exits!!");
    return res.redirect("/listings");
  }
  await Listing.findByIdAndDelete(id);
  // console.log("listing deleted!!");
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};

module.exports.renderReservationForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });
  res.render("listings/reserveListing.ejs", { listing });
};

module.exports.renderPaymentForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let { reservation } = req.body;
  const date1 = new Date(reservation.checkIn); // 2015-12-1
  const date2 = new Date(reservation.checkOut); // 2014-01-1

  const diff = new DateDiff(date2, date1);
  reservation.totalDays = diff.days();
  reservation.listingId = id;
  reservation.guestId = res.locals.CurrUser._id;
  reservation.hostId = listing.owner._id;
  reservation.pricePerNight = listing.price;
  reservation.total = listing.price;
  reservation.paymentProvider = "stripe";
  reservation.paymentStatus = "PROCESSING";
  let newBooking = new Booking(reservation);
  newBooking.save();
  reservation._id = newBooking._id;
  res.render("bookings/paymentForm.ejs", { listing, reservation });
};

module.exports.makePayment = async (req, res, next) => {
  let { id } = req.params;
  let { reservationId, cardDetails } = req.body;
  console.log("From make Payment: ");
  console.log("Listing ID: ", id);
  console.log("reservation ID: ", reservationId);
  console.log("card Details: ", cardDetails);
  res.render("bookings/bookingSuccess.ejs");
};

module.exports.reserveListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  res.render("bookings/bookingSuccess.ejs");
};
