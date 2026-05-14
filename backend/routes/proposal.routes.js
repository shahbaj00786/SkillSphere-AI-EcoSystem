import express from 'express';
import {
  createProposalController,
  getProposalController,
  getGigProposalsController,
  getFreelancerProposalsController,
  updateProposalController,
  deleteProposalController,
  acceptProposalController,
  rejectProposalController,
} from '../controllers/proposal.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, createProposalController);
router.get('/:id', getProposalController);
router.get('/gig/:gigId', getGigProposalsController);
router.get('/my-proposals', auth, getFreelancerProposalsController);
router.put('/:id', auth, updateProposalController);
router.delete('/:id', auth, deleteProposalController);
router.post('/:id/accept', auth, acceptProposalController);
router.post('/:id/reject', auth, rejectProposalController);

export default router;