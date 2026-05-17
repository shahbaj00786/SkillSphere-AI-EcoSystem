import * as reviewService from '../services/review.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const createReviewController = async (req, res, next) => {
  try {
    const { gigId, freelancerId, rating, comment, categories } = req.body;
    const data = {
      gigId,
      freelancerId,
      clientId: req.user.id,
      rating,
      comment,
      categories,
    };

    const review = await reviewService.createReviewService(data);
    res.status(201).json(apiResponse(201, review, 'Review created successfully'));
  } catch (error) {
    next(error);
  }
};

const getReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewByIdService(id);
    res.status(200).json(apiResponse(200, review, 'Review retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getFreelancerReviewsController = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await reviewService.getFreelancerReviewsService(
      freelancerId,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, result, 'Freelancer reviews retrieved'));
  } catch (error) {
    next(error);
  }
};

const getGigReviewsController = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const reviews = await reviewService.getGigReviewsService(gigId);
    res.status(200).json(apiResponse(200, reviews, 'Gig reviews retrieved'));
  } catch (error) {
    next(error);
  }
};

const updateReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.updateReviewService(id, req.user.id, req.body);
    res.status(200).json(apiResponse(200, review, 'Review updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReviewService(id, req.user.id);
    res.status(200).json(apiResponse(200, {}, 'Review deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const getFreelancerRatingController = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;
    const rating = await reviewService.getFreelancerRatingService(freelancerId);
    res.status(200).json(apiResponse(200, rating, 'Freelancer rating retrieved'));
  } catch (error) {
    next(error);
  }
};

const getVerifiedReviewsController = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const reviews = await reviewService.getVerifiedReviewsService(
      freelancerId,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, reviews, 'Verified reviews retrieved'));
  } catch (error) {
    next(error);
  }
};

export {
  createReviewController,
  getReviewController,
  getFreelancerReviewsController,
  getGigReviewsController,
  updateReviewController,
  deleteReviewController,
  getFreelancerRatingController,
  getVerifiedReviewsController,
};