require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const port = process.env.PORT;
// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("💒 Connected to MongoDB 💒"));

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.set("view engine", "ejs");
// Models
const contactList = require("./models/guestList");
const guestList = require("./models/guestList");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("signup", (req, res) => {
  res.render("signup");
});

// GET all contacts WORKING
app.get("/invited/guestlist", (req, res) => {
  contactList.find().then((results) => res.status(200).json(results));
});

// GET single contact using id WORKING
app.get("/invited/guestlist/:_id", (req, res) => {
  contactList
    .findById(req.params._id)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "Guest not found" });
      }
    })
    .catch((error) => res.status(401).json({ message: "Bad request" }));
});

// POST new contact WORKING
app.post("/invited/guestlist", (req, res) => {
  const newContact = new contactList(req.body);
  newContact.save();
  res.status(201).json(newContact);
});

// DELETE contact with ID NOT WORKING
app.delete("/invited/guestlist/:_id", (req, res) => {
  contactList
    .findById(req.params._id)
    .then((results) => {
      if (results) {
        contactList.contact._id(req.params.contactId).deleteOne();
        contactList.save();
        res.status(200).json(contactList);
      } else {
        res.status(400).json({ message: "Guest not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
