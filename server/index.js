require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT;

// Mongoose Connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.once("open", () => console.log("🦇 👨 Connected to MongoDB"));

const app = express();
app.use(express.json());
app.use(cors());

const Invited = ''

app.get("/invited", (req, res) => {
    res.json(Invited)
});

app.listen(port, () => console.log(`Application is running on port ${port}`));
