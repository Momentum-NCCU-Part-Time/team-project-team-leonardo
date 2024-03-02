const mongoose = require("mongoose");

function toLower(v) {
  if (v) {
    return v.toLowerCase();
  }
}

const Users = new mongoose.Schema({
  email: { type: String, set: toLower },
  password: String,
});

module.exports = mongoose.model("User", Users);
