import Gig from "../models/Gig.model.js";

const createGig = async (data) => {
  const gig = new Gig(data);
  return await gig.save();
};

const findGigById = async (id) => {
  return await Gig.findById(id).populate("clientId", "name email avatar").populate("proposals");
};

const findGigsByClientId = async (clientId, limit = 10, skip = 0) => {
  return await Gig.find({ clientId }).limit(limit).skip(skip).sort({ createdAt: -1 });
};

const findAllGigs = async (limit = 10, skip = 0) => {
  return await Gig.find({}).limit(limit).skip(skip).sort({ createdAt: -1 });
};

const updateGigById = async (id, updateData) => {
  return await Gig.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteGigById = async (id) => {
  return await Gig.findByIdAndDelete(id);
};

const findGigsByCategory = async (category, limit = 10, skip = 0) => {
  return await Gig.find({ category }).limit(limit).skip(skip);
};

const addProposalToGig = async (gigId, proposalId) => {
  return await Gig.findByIdAndUpdate(gigId, { $push: { proposals: proposalId } }, { new: true });
};

const selectProposal = async (gigId, proposalId) => {
  return await Gig.findByIdAndUpdate(gigId, { selectedProposal: proposalId, status: "in_progress" }, { new: true });
};

export {
  createGig,
  findGigById,
  findGigsByClientId,
  findAllGigs,
  updateGigById,
  deleteGigById,
  findGigsByCategory,
  addProposalToGig,
  selectProposal,
};