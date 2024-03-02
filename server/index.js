require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
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
app.use(morgan("dev"));

// Models
const contactList = require("./models/guestList");

app.get("/invited/guestList", (req, res) => {
    contactList.find().then((results) => res.status(200).json(results));
})

app.post("/invited/guestList", (req, res) => {
    const newContact = new contactList(req.body);
    newContact.save();
    res.status(201).json(newContact);
  });
app.listen(port, () => console.log(`Application is running on port ${port}`));
