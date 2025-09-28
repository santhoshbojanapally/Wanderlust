const express = require("express");
const mongoose = require("mongoose");
const app = express(); 
const path = require("path");
const methodOverride = require("method-override"); // used to implement PUT, PATCH, DELETE which are not supported by html
const ejsMate = require("ejs-mate"); //used to efficiently implement layouts and includes
const listings = require("./routes/listing.js");
const reviews= require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
};


app.use(session(sessionOptions));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

main().then(() => {
    console.log("Connected!");
}).catch(() => {
    console.log("Failed to connect!!");
})

app.listen(8080, () => {
    console.log("App is listening on port 8080...");
})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Home Route
app.get("/", (req, res) => {
    res.send("Home Route");
});


app.use("/listings", listings);
app.use("/listings/:id", reviews);

// Middleware to handle Errors!
app.use((err, req, res, next) => {
    const { status=400, message="Page Not found!" } = err;
    res.status(status).render("error.ejs", { message });
});