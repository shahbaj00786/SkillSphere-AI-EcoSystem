import * as reviewRepo from '../repositories/review.repo.js';
import * as gigRepo from '../repositories/gig.repo.js';

const createReviewService = async (data) => {
  const gig = await gigRepo.findGigById(data.gigId);
  if (!gig) throw new Error('Gig not found');

  const review = await reviewRepo.createReview(data);
  return review;
};

const getReviewByIdService = async (id) => {
  const review = await reviewRepo.findReviewById(id);
  if (!review) throw new Error('Review not found');
  return review;
};

const getFreelancerReviewsService = async (freelancerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const reviews = await reviewRepo.findReviewsByFreelancerId(freelancerId, limit, skip);
  const rating = await reviewRepo.getFreelancerRating(freelancerId);

  return {
    reviews,
    rating,
  };
};

const getGigReviewsService = async (gigId) => {
  return await reviewRepo.findReviewsByGigId(gigId);
};

const updateReviewService = async (reviewId, clientId, updateData) => {
  const review = await reviewRepo.findReviewById(reviewId);
  if (!review || review.clientId.toString() !== clientId) {
    throw new Error('Unauthorized');
  }

  const updated = await reviewRepo.updateReviewById(reviewId, updateData);
  return updated;
};

const deleteReviewService = async (reviewId, clientId) => {
  const review = await reviewRepo.findReviewById(reviewId);
  if (!review || review.clientId.toString() !== clientId) {
    throw new Error('Unauthorized');
  }

  return await reviewRepo.deleteReviewById(reviewId);
};

const getFreelancerRatingService = async (freelancerId) => {
  const rating = await reviewRepo.getFreelancerRating(freelancerId);
  if (!rating) throw new Error('No reviews found');
  return rating;
};

const getVerifiedReviewsService = async (freelancerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await reviewRepo.findVerifiedReviews(freelancerId, limit, skip);
};

export {
  createReviewService,
  getReviewByIdService,
  getFreelancerReviewsService,
  getGigReviewsService,
  updateReviewService,
  deleteReviewService,
  getFreelancerRatingService,
  getVerifiedReviewsService,
};