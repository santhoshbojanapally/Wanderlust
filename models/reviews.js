const { string, number, date } = require("joi");
const mongoose=require("mongoose");
const { type } = require("../Schema");
const Schema = mongoose.Schema;

let reviewSchema = new Schema({
    comment: {
        type: String,
        required:true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;