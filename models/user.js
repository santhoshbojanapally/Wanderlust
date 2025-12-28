let mongoose = require("mongoose");
let schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");
let userSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
