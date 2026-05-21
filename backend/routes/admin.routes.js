import express from 'express';
import {
  getAllUsersController,
  getUserController,
  suspendUserController,
  activateUserController,
  verifyFreelancerController,
  removeGigController,
  getDashboardStatsController,
  getAdminLogsController,
  processRefundController,
} from '../controllers/admin.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin middleware check can be added here
router.get('/dashboard/stats', auth, getDashboardStatsController);
router.get('/users', auth, getAllUsersController);
router.get('/users/:id', auth, getUserController);
router.post('/users/:id/suspend', auth, suspendUserController);
router.post('/users/:id/activate', auth, activateUserController);
router.post('/freelancers/:id/verify', auth, verifyFreelancerController);
router.post('/gigs/:id/remove', auth, removeGigController);
router.get('/logs', auth, getAdminLogsController);
router.post('/payments/:id/refund', auth, processRefundController);

export default router;