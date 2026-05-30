import express from 'express';
import { getMatchedGigsController, generateProposalController, getTrendingSkillsController } from '../controllers/ai.controller.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/match-gigs', auth, requireRole('freelancer'), getMatchedGigsController);
router.get('/generate-proposal/:gigId', auth, requireRole('freelancer'), generateProposalController);
router.get('/trending-skills', getTrendingSkillsController);

export default router;