import express from 'express';
import {
  createPaymentController,
  getPaymentController,
  getClientPaymentsController,
  getFreelancerPaymentsController,
  updatePaymentStatusController,
  releaseMilestoneController,
  getPaymentStatsController,
  processRefundController,
} from '../controllers/payment.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, createPaymentController);
router.get('/:id', auth, getPaymentController);
router.get('/client/payments', auth, getClientPaymentsController);
router.get('/freelancer/payments', auth, getFreelancerPaymentsController);
router.get('/freelancer/stats', auth, getPaymentStatsController);
router.put('/:id/status', auth, updatePaymentStatusController);
router.put('/:id/release-milestone', auth, releaseMilestoneController);
router.post('/:id/refund', auth, processRefundController);

export default router;