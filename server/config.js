const mongoose = require("mongoose");

function toLower(v) {
  if (v) {
    return v.toLowerCase();
  }
}

const LoginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
});
const collection = new mongoose.model("users", LoginSchema);
module.exports = collection;
