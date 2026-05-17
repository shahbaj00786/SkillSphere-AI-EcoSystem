import express from 'express';
import {
  createReviewController,
  getReviewController,
  getFreelancerReviewsController,
  getGigReviewsController,
  updateReviewController,
  deleteReviewController,
  getFreelancerRatingController,
  getVerifiedReviewsController,
} from '../controllers/review.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, createReviewController);
router.get('/:id', getReviewController);
router.get('/freelancer/:freelancerId', getFreelancerReviewsController);
router.get('/freelancer/:freelancerId/rating', getFreelancerRatingController);
router.get('/freelancer/:freelancerId/verified', getVerifiedReviewsController);
router.get('/gig/:gigId', getGigReviewsController);
router.put('/:id', auth, updateReviewController);
router.delete('/:id', auth, deleteReviewController);

export default router;