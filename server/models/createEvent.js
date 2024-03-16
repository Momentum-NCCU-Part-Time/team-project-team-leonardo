const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema({
//   createdAt: { type: Date, default: Date.now },
//   // event: [
//   //   {
//   eventName: { type: String, required: true },
//   eventDate: { type: String, required: true },
//   guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "contactList" }],
//   //   },
//   // ],
// });
// module.exports = mongoose.model("createEvent", eventSchema);

const eventSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  // event: [
  //   {
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  guests: [
    // {
    //   name: { type: String, required: true },
    //   image: { type: String },
    //   email: { type: String, unique: true },
    //   phone: { type: Number },
    //   address: {
    //     number: { type: Number },
    //     street: { type: String },
    //     city: { type: String },
    //     state: { type: String },
    //     postCode: { type: Number, minLength: 5, maxLength: 5 },
    //   },
    //   answers: [
    //     {
    //       type: new mongoose.Schema({
    //         response1: { type: String },
    //         response2: { type: String },
    //         response3: { type: String },
    //       }),
    //     },
    //   ],
    //   eventId: { type: mongoose.Schema.Types.ObjectId, ref: "createEvent" },
    // },
    // { timestamps: true },
  ],
  //   },
  // ],
});
module.exports = mongoose.model("createEvent", eventSchema);
