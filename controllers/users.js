const User = require("../models/User");
const asyncWrapper = require("../middleware/asyncWrapper");

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

const createUser = asyncWrapper(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
};
