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
  //eventDate: { type: String, required: true },
  guests: [{ type: mongoose.Schema.Types.Array, ref: "guestList" }],
});
module.exports = mongoose.model("createEvent", eventSchema);
