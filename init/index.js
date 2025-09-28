const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

main().then(() => {
    console.log("Connected!");
}).catch(() => {
    console.log("Failed to connect!!");
})

Listing.insertMany(initData.data, { runValidators: true, ordered: false });