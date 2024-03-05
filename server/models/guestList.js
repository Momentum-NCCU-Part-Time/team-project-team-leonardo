const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
  contact: [
    {
      firstName: { type: String },
      lastName: { type: String },
      image: { type: Buffer },
    },
  ],
});

module.exports = mongoose.model("guestList", listSchema);

const questionsSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now },
  questions: [
    {
      question1: { type: String },
      question2: { type: String },
      question3: { type: String },
    },
  ],
  invited: { type: Boolean },
});
module.exports = mongoose.model("questions", questionsSchema);

const contactSchema = new mongoose.Schema(
  {
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
        email: { type: String },
      },
    },
    answers: [
      {
        response1: { type: String },
        response2: { type: String },
        response3: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactList", contactSchema);
