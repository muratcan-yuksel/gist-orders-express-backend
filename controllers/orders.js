const Order = require("../models/Order");
const asyncWrapper = require("../middleware/asyncWrapper");

const getOrders = asyncWrapper(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({ success: true, data: orders });
});

const getOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: order });
});

const createOrder = asyncWrapper(async (req, res) => {
  const { stockCode, color, size, quantity, personalization, notes, user } =
    req.body;
  const order = await Order.create({
    user: user,
    stockCode: stockCode,
    color: color,
    size: size,
    quantity: quantity,
    personalization: personalization,
    notes: notes,
    file: req.file.path,
  });
  const savedOrder = await order.save();

  res.status(201).json({ success: true, data: savedOrder });
});

const deleteOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

const updateOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: order });
});

const getOrdersByUserId = asyncWrapper(async (req, res, next) => {
  const orders = await Order.find({ userId: req.params.userId });
  if (!orders) {
    return next(
      new ErrorResponse(
        `Orders not found for user with id of ${req.params.userId}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: orders });
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
};
