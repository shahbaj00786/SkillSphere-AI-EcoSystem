import Proposal from '../models/Proposal.model.js';

const createProposal = async (data) => {
  const proposal = new Proposal(data);
  return await proposal.save();
};

const findProposalById = async (id) => {
  return await Proposal.findById(id)
    .populate('gigId')
    .populate('freelancerId', 'name email avatar rating');
};

const findProposalsByGigId = async (gigId) => {
  return await Proposal.find({ gigId }).populate('freelancerId', 'name email avatar');
};

const findProposalsByFreelancerId = async (freelancerId, limit = 10, skip = 0) => {
  return await Proposal.find({ freelancerId }).limit(limit).skip(skip).sort({ createdAt: -1 });
};

const updateProposalById = async (id, updateData) => {
  return await Proposal.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteProposalById = async (id) => {
  return await Proposal.findByIdAndDelete(id);
};

const findProposalsByStatus = async (status, limit = 10, skip = 0) => {
  return await Proposal.find({ status }).limit(limit).skip(skip);
};

const acceptProposal = async (id) => {
  return await Proposal.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
};

const rejectProposal = async (id) => {
  return await Proposal.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
};

export {
  createProposal,
  findProposalById,
  findProposalsByGigId,
  findProposalsByFreelancerId,
  updateProposalById,
  deleteProposalById,
  findProposalsByStatus,
  acceptProposal,
  rejectProposal,
};