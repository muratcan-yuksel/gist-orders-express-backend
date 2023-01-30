const User = require("../models/User");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
  refreshTokens,
  verifyToken,
  refreshToken,
} = require("./auth");

const getUsers = asyncWrapper(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

const getUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: user });
});

//this is basically a register functionality
const createUser = asyncWrapper(async (req, res) => {
  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = await User.create({
    name: req.body.name,
    password: hashedPassword,
    isAdmin: req.body.isAdmin,
  });
  const savedUser = await user.save();

  res.status(201).json({ success: true, data: savedUser });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name: name });
  if (!user) return res.status(400).send("Name does not exist");
  //validate password
  //compare the password from the request with the password from the database
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");
  //create and assign a token
  //sends the user id with the token
  // const token = jwt.sign({ _id: userName._id }, process.env.TOKEN_SECRET);
  // res.header("auth-token", token).send(token);
  if (validPass) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    //push to the refreshtokens array
    refreshTokens.push(refreshToken);
    res.json({
      username: user.name,
      isAdmin: user.isAdmin,
      userId: user._id,
      accessToken,
      refreshToken,
    });
  } else {
    res.send({ message: "Login failed" });
  }
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  loginUser,
};
