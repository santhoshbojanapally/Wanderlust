const { ref, required } = require("joi");
const mongoose = require("mongoose");
const Listing = require("./listing");
const User = require("./user");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guestsCount: { type: Number, required: true, min: 1 },
  adultsCount: { type: Number, required: true, min: 1 },
  childrenCount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "PENDING_PAYMENT",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
      "REFUNDED",
    ],
    default: "PENDING_PAYMENT",
    index: true,
  },
  pricePerNight: { type: Number, required: true, min: 0 },
  nights: { type: Number, min: 1 },
  fees: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentProvider: {
    type: String,
    enum: ["stripe", "razorpay", "paypal"],
    default: "stripe",
  },
  paymentIntentId: { type: String },
  checkoutSessionId: { type: String },
  paymentStatus: {
    type: String,
    enum: ["REQUIRES_ACTION", "PROCESSING", "SUCCEEDED", "FAILED", "REFUNDED"],
    default: "REQUIRES_ACTION",
    index: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
