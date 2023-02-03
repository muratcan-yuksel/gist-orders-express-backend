const Order = require("../models/Order");
const asyncWrapper = require("../middleware/asyncWrapper");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

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
  const {
    stockCode,
    color,
    size,
    quantity,
    personalization,
    notes,
    user,
    name,
    status,
  } = req.body;
  const order = await Order.create({
    user: user,
    stockCode: stockCode,
    name: name,
    color: color,
    size: size,
    quantity: quantity,
    personalization: personalization,
    notes: notes,
    file: req.file.path,
    status: status,
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

// const getOrdersByUserId = asyncWrapper(async (req, res, next) => {
//   const orders = await Order.find({ user: req.params.user });
//   if (!orders) {
//     return next(
//       new ErrorResponse(
//         `Orders not found for user with id of ${req.params.userId}`,
//         404
//       )
//     );
//   }
//   res.status(200).json({ success: true, data: orders });
// });

const getOrdersByUserId = asyncWrapper(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.user });
  if (!orders) {
    return next(
      new ErrorResponse(
        `Orders not found for user with id of ${req.params.userId}`,
        404
      )
    );
  }

  const ordersWithBase64 = orders.map((order) => {
    const imageBase64 = order.file.toString("base64");
    return {
      ...order.toObject(),
      file: `data:image/jpeg;base64,${imageBase64}`,
    };
  });

  res.status(200).json({
    success: true,
    data: ordersWithBase64,
  });
});

// const fileName = req.params.fileName;
// const filePath = path.join(__dirname, "uploads", fileName);

// fs.readFile(filePath, (err, data) => {
//   if (err) {
//     return res.status(400).send("File not found.");
//   }

//   res.setHeader("Content-Type", "application/octet-stream");
//   res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
//   res.send(data);
// });

const downloadFile = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  const file = order.file;
  const filePath = path.join(__dirname, "..", "..", "api", file);

  const filename = path.basename(file);
  const mimetype = mime.lookup(file);

  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimetype);

  return res.sendFile(filePath);
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  getOrdersByUserId,
  downloadFile,
};
