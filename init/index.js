const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

main()
  .then(() => {
    console.log("Connected!");
  })
  .catch(() => {
    console.log("Failed to connect!!");
  });

const initDB = () => {
  console.log("Data initialized!!!");
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "694ca4f38f7b0975f474754b",
    geometry: {
      type: "Point",
      coordinates: [39.75621, -104.99404],
    },
    category: ["OMG!", "Mountains"],
  }));
  Listing.insertMany(initData.data, {
    runValidators: true,
    ordered: false,
  });
};

initDB();
