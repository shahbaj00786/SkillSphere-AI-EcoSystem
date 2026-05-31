import { Router } from 'express';
import {
  createDisputeController,
  getDisputeController,
  getOpenDisputesController,
  getUserDisputesController,
  updateDisputeController,
  resolveDisputeController,
  rejectDisputeController,
} from '../controllers/dispute.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:id', auth, getDisputeController);
router.post('/', auth, createDisputeController);
router.get('/open', auth, getOpenDisputesController);
router.get('/my', auth, getUserDisputesController);
router.put('/:id', auth, updateDisputeController);
router.put('/:id/resolve', auth, resolveDisputeController);
router.put('/:id/reject', auth, rejectDisputeController);

export default router;