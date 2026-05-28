import Payment from '../models/Payment.model.js';
import mongoose from 'mongoose';

const createPayment = async (data) => {
  const payment = new Payment(data);
  return await payment.save();
};

const findPaymentById = async (id) => {
  return await Payment.findById(id)
    .populate('gigId')
    .populate('proposalId')
    .populate('clientId', 'name email')
    .populate('freelancerId', 'name email');
};

const findPaymentsByClientId = async (clientId, limit = 10, skip = 0) => {
  return await Payment.find({ clientId })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const findPaymentsByFreelancerId = async (freelancerId, limit = 10, skip = 0) => {
  return await Payment.find({ freelancerId })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const findPaymentsByGigId = async (gigId) => {
  return await Payment.find({ gigId });
};

const updatePaymentById = async (id, updateData) => {
  return await Payment.findByIdAndUpdate(id, updateData, { new: true });
};

const updateMilestoneStatus = async (paymentId, milestoneIndex, status) => {
  return await Payment.findByIdAndUpdate(
    paymentId,
    { $set: { [`milestones.${milestoneIndex}.status`]: status } },
    { new: true }
  );
};

const findPaymentsByStatus = async (status, limit = 10, skip = 0) => {
  return await Payment.find({ status })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const getPaymentStats = async (userId) => {
  return await Payment.aggregate([
    { $match: { freelancerId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$freelancerAmount' },
        completedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        pendingAmount: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$freelancerAmount', 0] },
        },
      },
    },
  ]);
};

export {
  createPayment,
  findPaymentById,
  findPaymentsByClientId,
  findPaymentsByFreelancerId,
  findPaymentsByGigId,
  updatePaymentById,
  updateMilestoneStatus,
  findPaymentsByStatus,
  getPaymentStats,
};

