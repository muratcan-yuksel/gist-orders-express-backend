//write an express server
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDB = require("./database/connect");

// mongoose.connect(process.env.MONGO_CONNECTION_STRING, () =>
//   console.log("connected to db")
// );

app.use(express.json());
//import routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

//route middlewares
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
