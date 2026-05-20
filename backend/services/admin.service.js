import User from '../models/User.model.js';
import Gig from '../models/Gig.model.js';
import AdminLog from '../models/AdminLog.model.js';
import Payment from '../models/Payment.model.js';

const getAllUsersService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await User.find({}).limit(limit).skip(skip).sort({ createdAt: -1 });
};

const getUserByIdService = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

const suspendUserService = async (userId, adminId, reason) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isSuspended: true, suspendReason: reason },
    { new: true }
  );

  await AdminLog.create({
    adminId,
    action: 'user_suspended',
    targetId: userId,
    targetModel: 'User',
    description: reason,
  });

  return user;
};

const activateUserService = async (userId, adminId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isSuspended: false, suspendReason: null },
    { new: true }
  );

  await AdminLog.create({
    adminId,
    action: 'user_verified',
    targetId: userId,
    targetModel: 'User',
  });

  return user;
};

const verifyFreelancerService = async (freelancerId, adminId) => {
  const user = await User.findByIdAndUpdate(
    freelancerId,
    { isVerified: true },
    { new: true }
  );

  await AdminLog.create({
    adminId,
    action: 'user_verified',
    targetId: freelancerId,
    targetModel: 'User',
    description: 'Freelancer verified',
  });

  return user;
};

const removeGigService = async (gigId, adminId, reason) => {
  const gig = await Gig.findByIdAndUpdate(
    gigId,
    { status: 'cancelled' },
    { new: true }
  );

  await AdminLog.create({
    adminId,
    action: 'gig_removed',
    targetId: gigId,
    targetModel: 'Gig',
    description: reason,
  });

  return gig;
};

const getDashboardStatsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalGigs = await Gig.countDocuments();
  const totalPayments = await Payment.countDocuments({ status: 'completed' });
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$platformFee' } } },
  ]);

  const activeUsers = await User.countDocuments({ isSuspended: false });
  const suspendedUsers = await User.countDocuments({ isSuspended: true });

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    totalGigs,
    totalPayments,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
  };
};

const getAdminLogsService = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return await AdminLog.find({})
    .populate('adminId', 'name email')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const processRefundService = async (paymentId, adminId, reason) => {
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { status: 'refunded' },
    { new: true }
  );

  await AdminLog.create({
    adminId,
    action: 'payment_refunded',
    targetId: paymentId,
    targetModel: 'Payment',
    description: reason,
  });

  return payment;
};

export {
  getAllUsersService,
  getUserByIdService,
  suspendUserService,
  activateUserService,
  verifyFreelancerService,
  removeGigService,
  getDashboardStatsService,
  getAdminLogsService,
  processRefundService,
};