//write an express server
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDB = require("./database/connect");
const cors = require("cors");

// mongoose.connect(process.env.MONGO_CONNECTION_STRING, () =>
//   console.log("connected to db")
// );

app.use(express.json());
app.use(cors());

//import routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

//route middlewares
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

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
