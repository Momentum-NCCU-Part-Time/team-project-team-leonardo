require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

// Adding in for images
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const imgSchema = require("./models/images");
const createEvent = require("./models/createEvent");

const app = express();

// express to find files from node modules
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));

//convert data into json format

const port = process.env.PORT;
// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("💒 Connected to MongoDB 💒"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
// use EJS as the view egnine
app.set("view engine", "ejs");
//static file
app.use(express.static("public"));

// Adding in for IMAGES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  imgSchema.find({}).then((data, err) => {
    if (err) {
      console.log(err);
    }
    res.render("imagePage", { items: data });
  });
});

app.post("/", upload.single("image"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
      contentType: "image/png",
    },
  };
  imgSchema.create(obj).then((err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });
});
// END Images add in

// Models
const contactList = require("./models/guestList");
const guestList = require("./models/guestList");
const { resolve6 } = require("dns/promises");

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//register User
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // check if the user already exists
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    //hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; //replace the hash password with original password

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

//login user
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("username not found");
    }

    //compare the hash password in DB with plain text
    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPasswordMatch) {
      res.render("newEvent");
    } else {
      req.send("wrong password");
    }
  } catch {
    res.send("Please try again");
  }
});

// Display contact card
app.get("/invited/guestlist", async (req, res) => {
  try {
    const guests = await contactList.find();
    res.render("pages/store", { guests });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

// GET created events
app.get("/invited", (req, res) => {
  createEvent.find().then((results) => res.status(200).json(results));
});

// POST new event
app.post("/invited", (req, res) => {
  const newEvent = new createEvent(req.body);
  newEvent.save();
  res.status(201).json(newEvent);
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
