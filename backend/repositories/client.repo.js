import clientModel from '../models/Client.model.js';

const createClient = async (data) => {
  const client = new clientModel(data);
  return await client.save();
};

const findClientByUserId = async (userId) => {
  return await clientModel.findOne({ userId });
};

const findClientById = async (id) => {
  return await clientModel.findById(id);
};

const updateClientByUserId = async (userId, updateData) => {
  return await clientModel.findOneAndUpdate({ userId }, updateData, { new: true });
};

const getAllClients = async () => {
  return await clientModel.find({}).populate('userId', 'name email avatar');
};

export {
  createClient,
  findClientByUserId,
  findClientById,
  updateClientByUserId,
  getAllClients,
};