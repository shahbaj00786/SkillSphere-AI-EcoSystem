import Review from '../models/Review.model.js';

const createReview = async (data) => {
  const review = new Review(data);
  return await review.save();
};

const findReviewById = async (id) => {
  return await Review.findById(id)
    .populate('freelancerId', 'name avatar')
    .populate('clientId', 'name avatar')
    .populate('gigId', 'title');
};

const findReviewsByFreelancerId = async (freelancerId, limit = 10, skip = 0) => {
  return await Review.find({ freelancerId })
    .populate('clientId', 'name avatar')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const findReviewsByGigId = async (gigId) => {
  return await Review.find({ gigId })
    .populate('clientId', 'name avatar')
    .populate('freelancerId', 'name avatar');
};

const updateReviewById = async (id, updateData) => {
  return await Review.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteReviewById = async (id) => {
  return await Review.findByIdAndDelete(id);
};

const getFreelancerRating = async (freelancerId) => {
  const result = await Review.aggregate([
    { $match: { freelancerId } },
    {
      $group: {
        _id: '$freelancerId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        avgCommunication: { $avg: '$categories.communication' },
        avgQuality: { $avg: '$categories.quality' },
        avgTimeliness: { $avg: '$categories.timeliness' },
        avgProfessionalism: { $avg: '$categories.professionalism' },
      },
    },
  ]);

  return result.length > 0 ? result[0] : null;
};

const findVerifiedReviews = async (freelancerId, limit = 10, skip = 0) => {
  return await Review.find({ freelancerId, isVerified: true })
    .populate('clientId', 'name avatar')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

export {
  createReview,
  findReviewById,
  findReviewsByFreelancerId,
  findReviewsByGigId,
  updateReviewById,
  deleteReviewById,
  getFreelancerRating,
  findVerifiedReviews,
};