import * as paymentRepo from '../repositories/payment.repo.js';

const PLATFORM_FEE_PERCENTAGE = 0.10;

const createPaymentService = async (data) => {
  const platformFee = Math.round(data.amount * PLATFORM_FEE_PERCENTAGE);
  const freelancerAmount = data.amount - platformFee;

  const paymentData = {
    ...data,
    platformFee,
    freelancerAmount,
    status: 'pending',
  };

  return await paymentRepo.createPayment(paymentData);
};

const getPaymentByIdService = async (id) => {
  const payment = await paymentRepo.findPaymentById(id);
  if (!payment) throw new Error('Payment not found');
  return payment;
};

const getClientPaymentsService = async (clientId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await paymentRepo.findPaymentsByClientId(clientId, limit, skip);
};

const getFreelancerPaymentsService = async (freelancerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await paymentRepo.findPaymentsByFreelancerId(freelancerId, limit, skip);
};

const updatePaymentStatusService = async (paymentId, status) => {
  return await paymentRepo.updatePaymentById(paymentId, { status });
};

const releaseMilestonePaymentService = async (paymentId, milestoneIndex) => {
  const payment = await paymentRepo.findPaymentById(paymentId);
  if (!payment) throw new Error('Payment not found');

  const milestone = payment.milestones[milestoneIndex];
  if (!milestone) throw new Error('Milestone not found');

  return await paymentRepo.updateMilestoneStatus(paymentId, milestoneIndex, 'released');
};

const getPaymentStatsService = async (userId) => {
  const stats = await paymentRepo.getPaymentStats(userId);
  if (stats.length === 0) {
    return {
      totalEarnings: 0,
      completedPayments: 0,
      pendingAmount: 0,
    };
  }
  return stats[0];
};

const processRefundService = async (paymentId) => {
  const payment = await paymentRepo.findPaymentById(paymentId);
  if (!payment) throw new Error('Payment not found');

  return await paymentRepo.updatePaymentById(paymentId, { status: 'refunded' });
};

export {
  createPaymentService,
  getPaymentByIdService,
  getClientPaymentsService,
  getFreelancerPaymentsService,
  updatePaymentStatusService,
  releaseMilestonePaymentService,
  getPaymentStatsService,
  processRefundService,
};