const Client = require("../models/Client");
const asyncWrapper = require("../middleware/asyncWrapper");

const getClients = asyncWrapper(async (req, res) => {
  const clients = await Client.find();
  res.status(200).json({ success: true, data: clients });
});

const getClient = asyncWrapper(async (req, res, next) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return next(
      new ErrorResponse(`Client not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: client });
});

const createClient = asyncWrapper(async (req, res) => {
  const client = await Client.create(req.body);
  res.status(201).json({ success: true, data: client });
});

const deleteClient = asyncWrapper(async (req, res, next) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) {
    return next(
      new ErrorResponse(`Client not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getClients,
  getClient,
  createClient,
  deleteClient,
};
