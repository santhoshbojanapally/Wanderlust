const mongoose=require("mongoose");
const { type } = require("../Schema");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review  = require("./reviews.js");
const ExpressError = require("../utils/ExpressError.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
            default:"Villa",
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: 
                (v) => {
                    return v === "" ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v;
                }
        }
    },
    price: {
        type: Number,
        required:true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required:true,
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
});


listingSchema.post("findOneAndDelete", async (listing, next) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    else next(new ExpressError(400, "Bad request"));
});



const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;