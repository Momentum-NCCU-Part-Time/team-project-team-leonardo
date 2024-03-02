require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT;

// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log( "💒 Connected to MongoDB 💒"));

const app = express();
app.use(express.json());
app.use(cors());

// Models
const contactList = require("./models/guestList");

app.get("/invited/guestList", (req, res) => {
    contactList.find().then((results) => res.status(200).json(results));
})
// app.get("/guestList", (req, res) => {
//     res.json(Invited)
// });

app.listen(port, () => console.log(`Application is running on port ${port}`));
