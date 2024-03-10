require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

// Adding in for images
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const imgSchema = require('./models/images')

const app = express();

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
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  imgSchema.find({})
  .then((data, err)=>{
      if(err){
          console.log(err);
      }
      res.render('imagePage',{items: data})
  })
});


app.post('/', upload.single('image'), (req, res, next) => {

  var obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  imgSchema.create(obj)
  .then ((err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/');
      }
  });
});
// END Images add in

// Models
const contact = require("./models/guestList");
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
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("index");
    } else {
      req.send("wrong password");
    }
  } catch {
    res.send("Please try again");
  }
});

// GET all contacts WORKING
app.get("/invited/guestlist", (req, res) => {
  contact.find().then((results) => res.status(200).json(results));
});

// GET single contact using id WORKING
app.get("/invited/guestlist/:_id", (req, res) => {
  contact
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

// GET answers for a contact using id NOT WORKING, showing all contact info
app.get("/invited/guestlist/:_id/answers/", (req, res) => {
  contact
    .findById(req.params._id)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "Answers not found" });
      }
    })
    .catch((error) => res.status(401).json({ message: "Bad request" }));
});

// POST new contact WORKING
app.post("/invited/guestlist", (req, res) => {
  const newContact = new contact(req.body);
  newContact.save();
  res.status(201).json(newContact);
});

// DELETE contact with ID WORKING
app.delete("/invited/guestlist/:_id", (req, res) => {
  contact
    .findByIdAndDelete(req.params._id)
    .then((contact) => {
      if (contact) {
        res.status(200).json({ message: "Contact Deleted" });
      } else {
        res.status(404).json({ message: "Contact Not Found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad Delete Request " }));
});

// PATCH to update contact name WORKING
app.patch("/invited/guestlist/:_id", (req, res) => {
  contact.findById(req.params._id).then((contact) => {
    if (contact) {
      contact.name = req.body.name || contact.name;
      contact.save();
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  });
});

// PATCH to update answers WORKING
app.patch("/invited/guestlist/:contactId/answers/:answersId", (req, res) => {
  contact.findById(req.params.contactId).then((contact) => {
    if (!contact) {
      res.status(404).json({ message: "Contact Not Found" });
    } else {
      const answers = contact.answers.id(req.params.answersId);
      if (!answers) {
        res.status(404).json({ message: "Answers not found" });
      } else {
        const { response1, response2, response3 } = req.body;
        answers.response1 = response1 || answers.response1;
        answers.response2 = response2 || answers.response2;
        answers.response3 = response3 || answers.response3;
        contact
          .save()
          .then(() => res.status(201).json(answers))
          .catch((error) => res.status(400).json({ message: "Bad Request " }));
      }
    }
  });
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
