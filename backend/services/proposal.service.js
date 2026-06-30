import Proposal from "../models/proposal.model.js";
import Gig from "../models/Gig.model.js";

export const createProposalService = async (data) => {
  return await Proposal.create(data);
};

export const getProposalByIdService = async (id) => {
  return await Proposal.findById(id).populate("gigId").populate("freelancerId");
};

export const getGigProposalsService = async (gigId) => {
  return await Proposal.find({ gigId }).populate("freelancerId");
};

export const getFreelancerProposalsService = async (freelancerId, page, limit) => {
  return await Proposal.find({ freelancerId })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("gigId");
};

export const updateProposalService = async (id, freelancerId, updateData) => {
  return await Proposal.findOneAndUpdate({ _id: id, freelancerId }, updateData, { new: true });
};

export const deleteProposalService = async (id, freelancerId) => {
  return await Proposal.findOneAndDelete({ _id: id, freelancerId });
};

export const acceptProposalService = async (id) => {
  return await Proposal.findByIdAndUpdate(id, { status: "accepted" }, { new: true });
};

export const rejectProposalService = async (id) => {
  return await Proposal.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
};

export const getGigByIdForNotif = async (gigId) => {
  return await Gig.findById(gigId).select("clientId title");
};