const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
  contact: [
    {
      firstName: { type: String },
      lastName: { type: String },
      image: { type: Buffer },
      questions: {
        question1: { type: String },
        question2: { type: String },
        question3: { type: String },
      },
      invited: { type: Boolean },
    },
  ],
});

module.exports = mongoose.model("guestList", listSchema);

const contactSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  image: { type: Buffer },
  location: {
    street: {
      number: { type: Number },
      name: { type: String },
      city: { type: String },
      state: { type: String },
      postcode: { type: Number },
      phoneNumber: { type: Number },
    },
  },
});

module.exports = mongoose.model("contactList", contactSchema);
