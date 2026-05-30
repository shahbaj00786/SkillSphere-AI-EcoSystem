import express from 'express';
import { getFreelancerAnalyticsController, getClientAnalyticsController } from '../controllers/analytics.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/freelancer', auth, getFreelancerAnalyticsController);
router.get('/client', auth, getClientAnalyticsController);

export default router;