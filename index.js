//write an express server
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(process.env.MONGO_CONNECTION_STRING, () =>
  console.log("connected to db")
);

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
