const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  email: {
    type: String,
    required: [true, "Username is required!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Username is required!"],
  },
  role: {
    type: String,
    enum: ["user", "employer"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
