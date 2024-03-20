require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

// AWS fileparser
const fileparser = require("./fileparser");

const app = express();

// express to find files from node modules
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);

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

// Models
const createEvent = require("./models/createEvent");
const contactList = require("./models/guestList");
const guestList = require("./models/guestList");
const { resolve6 } = require("dns/promises");

// AWS S3 Setup - JG - Can see basic page at http://localhost:3000 when server is running
app.set("json spaces", 5); // to pretify json response

app.get("/", (req, res) => {
  res.send(`
    <h2>File Upload With <code>"Node.js"</code></h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Select a file: 
        <input name="file" type="file" />
      </div>
      <input type="submit" value="Upload" />
    </form>

  `);
});

app.post("/api/upload", async (req, res) => {
  await fileparser(req)
    .then((data) => {
      res.status(200).json({
        message: "Success",
        data,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "An error occurred.",
        error,
      });
    });
});
// AWS S3 End

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
      res.redirect("/invited");
    } else {
      req.send("wrong password");
    }
  } catch {
    res.send("Please try again");
  }
});

app.get("/invited", (req, res) => {
  res.render("newEvent");
});
// Display contact card
app.get("/invited/guestlist", async (req, res) => {
  try {
    const guests = await contactList.find();
    res.render("card", { guests });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
});

//GET event by id
app.get("/invited/events/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    createEvent.findById(eventId).then((event) => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error");
  }
});

// app.get("/invited/guestlist", (req, res) => {
//   res.render("pages/index", { guests });
// });

// GET created events
// app.get("/invited/events", async (req, res) => {
//   try {
//     const createdEvent = await createEvent.find();
//     // res.render("createdEvent", { newEvent });
//   } catch (err) {
//     res.status(500).json({ message: "internal server error" });
//   }
// });

//test get render

//GET all events
// app.get("/invited/events", (req, res) => {
//   createEvent.find().then((results) => res.status(200).json(results));
// });

app.get("/invited/events", (req, res) => {
  res.render("newEvent", { createEvent });
});
// app.get("/invited/events", async (req, res) => {
//   try {
//     // Fetch events from the database
//     const events = await createEvent.find();

//     // Render the EJS view and pass the fetched events as a variable
//     res.render("events", { newEvent });
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// POST new event
app.post("/invited", (req, res) => {
  const newEvent = new createEvent(req.body);
  newEvent.save();
  res.status(201).json(newEvent);
});

// GET event, render to newEvent page
// app.get("/invited/events", async (req, res) => {
//   try {
//     const events = await createEvent.find();
//     res.render("getEvents", { events }).then((results) => {
//       if (results) {
//         res.status(200).json(results);
//       } else {
//         res.status(404).json({ message: "not found" });
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ message: "internal server error" });
//   }
// });

// PATCH add guest to event
app.patch("/invited/:eventId/guests", (req, res) => {
  const eventId = req.params.eventId;
  createEvent
    .findByIdAndUpdate(req.params.eventId, {
      $push: {
        guests: req.body.guests,
      },
    })
    .then((createEvent) => {
      console.log("HERE", eventId);
      if (createEvent) {
        res.status(200).send(createEvent);
      } else {
        res.status(404).json({ message: " Event not found" });
      }
    });
});

// GET all contacts WORKING
app.get("/invited/guestlist", (req, res) => {
  contactList.find().then((results) => res.status(200).json(results));
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

// GET event by id
app.get("/invited/:eventId", (req, res) => {
  createEvent
    .findById(req.params.eventId)
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
});

// PATCH add guest to event
app.patch("/invited/:eventId/guests", (req, res) => {
  const eventId = req.params.eventId;
  createEvent
    .findByIdAndUpdate(req.params.eventId, {
      $push: {
        guests: req.body.guests,
      },
    })
    .then((createEvent) => {
      console.log("HERE", eventId);
      if (createEvent) {
        res.status(200).send(createEvent);
      } else {
        res.status(404).json({ message: " Event not found" });
      }
    });
});

app.post("/invited/:eventId/guest", (req, res) => {
  createEvent
    .findById(eventId)
    .populate("guests")
    .exec((err, event) => {
      if (err) {
        // Handle error
      } else {
        console.log(event);
      }
    });
});

app.get("/invited/:eventId/guests", (req, res) => {
  createEvent
    .findById(req.params.eventId)
    .populate("guests")
    .then((results) => {
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(400).json({ message: "Bad request" }));
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
