import mongoose from 'mongoose';
import Dispute from '../models/Dispute.model.js';

const createDispute = async (data) => {
  const dispute = new Dispute(data);
  return await dispute.save();
};

const findDisputeById = async (id) => {
  return await Dispute.findById(id)
    .populate('paymentId')
    .populate('gigId')
    .populate('raisedBy', 'name avatar')
    .populate('respondedBy', 'name avatar');
};

const findDisputesByPaymentId = async (paymentId) => {
  return await Dispute.find({ paymentId }).populate('raisedBy', 'name avatar');
};

const findDisputesByStatus = async (status, limit = 10, skip = 0) => {
  return await Dispute.find({ status })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const findDisputesByUser = async (userId, limit = 10, skip = 0) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  return await Dispute.find({
    $or: [{ raisedBy: objectId }, { respondedBy: objectId }],
  })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const updateDisputeById = async (id, updateData) => {
  return await Dispute.findByIdAndUpdate(id, updateData, { new: true });
};

const resolveDispute = async (id, resolution, resolvedBy) => {
  return await Dispute.findByIdAndUpdate(
    id,
    { status: 'resolved', resolution, resolvedBy },
    { new: true }
  );
};

const rejectDispute = async (id) => {
  return await Dispute.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
};

export {
  createDispute,
  findDisputeById,
  findDisputesByPaymentId,
  findDisputesByStatus,
  findDisputesByUser,
  updateDisputeById,
  resolveDispute,
  rejectDispute,
};