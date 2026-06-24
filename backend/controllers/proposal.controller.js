import * as proposalService from '../services/proposal.service.js';
import { getGigByIdForNotif } from '../services/proposal.service.js';
import * as notifService from '../services/notification.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const createProposalController = async (req, res, next) => {
  try {
    const { gigId, title, description, bidAmount, estimatedDays, attachments, portfolio } = req.body;
    const data = { gigId, freelancerId: req.user.id, title, description, bidAmount, estimatedDays, attachments, portfolio };
    const proposal = await proposalService.createProposalService(data);
    try {
      const gig = await getGigByIdForNotif(gigId);
      if (gig?.clientId) {
        await notifService.createNotificationService({
          userId: gig.clientId,
          type: 'proposal_received',
          title: 'New Proposal Received',
          message: `A freelancer submitted a proposal on your gig "${gig.title}"`,
        });
      }
    } catch {}
    res.status(201).json(apiResponse(201, proposal, 'Proposal created successfully'));
  } catch (error) { next(error); }
};

const getProposalController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const proposal = await proposalService.getProposalByIdService(id);
    res.status(200).json(apiResponse(200, proposal, 'Proposal retrieved successfully'));
  } catch (error) { next(error); }
};

const getGigProposalsController = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const proposals = await proposalService.getGigProposalsService(gigId);
    res.status(200).json(apiResponse(200, proposals, 'Gig proposals retrieved'));
  } catch (error) { next(error); }
};

const getFreelancerProposalsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const proposals = await proposalService.getFreelancerProposalsService(req.user.id, parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, proposals, 'Freelancer proposals retrieved'));
  } catch (error) { next(error); }
};

const updateProposalController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const proposal = await proposalService.updateProposalService(id, req.user.id, req.body);
    res.status(200).json(apiResponse(200, proposal, 'Proposal updated successfully'));
  } catch (error) { next(error); }
};

const deleteProposalController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await proposalService.deleteProposalService(id, req.user.id);
    res.status(200).json(apiResponse(200, {}, 'Proposal deleted successfully'));
  } catch (error) { next(error); }
};

const acceptProposalController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const proposal = await proposalService.acceptProposalService(id, req.user.id);
    try {
      await notifService.createNotificationService({
        userId: proposal.freelancerId,
        type: 'proposal_accepted',
        title: 'Proposal Accepted! 🎉',
        message: `Your proposal "${proposal.title}" has been accepted by the client.`,
      });
    } catch {}
    res.status(200).json(apiResponse(200, proposal, 'Proposal accepted successfully'));
  } catch (error) { next(error); }
};

const rejectProposalController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const proposal = await proposalService.rejectProposalService(id, req.user.id);
    try {
      await notifService.createNotificationService({
        userId: proposal.freelancerId,
        type: 'proposal_received',
        title: 'Proposal Update',
        message: `Your proposal "${proposal.title}" was not selected this time.`,
      });
    } catch {}
    res.status(200).json(apiResponse(200, proposal, 'Proposal rejected successfully'));
  } catch (error) { next(error); }
};

export {
  createProposalController,
  getProposalController,
  getGigProposalsController,
  getFreelancerProposalsController,
  updateProposalController,
  deleteProposalController,
  acceptProposalController,
  rejectProposalController,
};