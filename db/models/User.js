const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  firstName: { type: String },
  lastName: { type: String },
});

module.exports = model("User", UserSchema);
