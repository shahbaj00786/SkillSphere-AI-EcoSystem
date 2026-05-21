import * as disputeRepo from '../repositories/dispute.repo.js';

const createDisputeService = async (data) => {
  return await disputeRepo.createDispute(data);
};

const getDisputeByIdService = async (id) => {
  const dispute = await disputeRepo.findDisputeById(id);
  if (!dispute) throw new Error('Dispute not found');
  return dispute;
};

const getDisputesByPaymentService = async (paymentId) => {
  return await disputeRepo.findDisputesByPaymentId(paymentId);
};

const getOpenDisputesService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await disputeRepo.findDisputesByStatus('open', limit, skip);
};

const getUserDisputesService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await disputeRepo.findDisputesByUser(userId, limit, skip);
};

const updateDisputeService = async (disputeId, updateData) => {
  return await disputeRepo.updateDisputeById(disputeId, updateData);
};

const resolveDisputeService = async (disputeId, resolution, resolvedBy) => {
  return await disputeRepo.resolveDispute(disputeId, resolution, resolvedBy);
};

const rejectDisputeService = async (disputeId) => {
  return await disputeRepo.rejectDispute(disputeId);
};

export {
  createDisputeService,
  getDisputeByIdService,
  getDisputesByPaymentService,
  getOpenDisputesService,
  getUserDisputesService,
  updateDisputeService,
  resolveDisputeService,
  rejectDisputeService,
};