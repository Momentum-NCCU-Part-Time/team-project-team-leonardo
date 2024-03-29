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
    name: { type: String, required: true },
    image: { type: String },
    email: { type: String, unique: true },
    phone: { type: Number },
    address: {
      number: { type: Number },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postCode: { type: Number, minLength: 5, maxLength: 5 },
    },
    answers: [
      {
        type: new mongoose.Schema({
          response1: { type: String },
          response2: { type: String },
          response3: { type: String },
        }),
      },
    ],
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "createEvent" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactList", contactSchema);
