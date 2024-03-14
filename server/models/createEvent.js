const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  event: [
    {
      eventName: { type: String, required: true },
      eventDate: { type: String, required: true },
    },
  ],
});
module.exports = mongoose.model("createEvent", eventSchema);
