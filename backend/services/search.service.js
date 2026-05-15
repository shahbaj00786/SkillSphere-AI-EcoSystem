import Gig from '../models/Gig.model.js';
import Freelancer from '../models/Freelancer.model.js';

const searchGigs = async (filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = {};

  // Location-based search
  if (filters.location) {
    query['clientId.location'] = { $regex: filters.location, $options: 'i' };
  }

  // Skill-based search
  if (filters.skills && filters.skills.length > 0) {
    query.requiredSkills = { $in: filters.skills };
  }

  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    query['budget.min'] = { $gte: filters.minPrice || 0 };
    query['budget.max'] = { $lte: filters.maxPrice || 999999 };
  }

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Rating filter
  if (filters.minRating) {
    query.clientRating = { $gte: filters.minRating };
  }

  // Status filter
  if (filters.status) {
    query.status = filters.status;
  }

  const gigs = await Gig.find(query)
    .limit(limit)
    .skip(skip)
    .populate('clientId', 'name avatar rating')
    .sort({ createdAt: -1 });

  const total = await Gig.countDocuments(query);

  return {
    gigs,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

const searchFreelancers = async (filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = {};

  // Location-based search
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }

  // Skill-based search
  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $in: filters.skills };
  }

  // Price range filter (hourly rate)
  if (filters.minPrice || filters.maxPrice) {
    query.hourlyRate = {
      $gte: filters.minPrice || 0,
      $lte: filters.maxPrice || 999999,
    };
  }

  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }

  // Rating filter
  if (filters.minRating) {
    query.rating = { $gte: filters.minRating };
  }

  const freelancers = await Freelancer.find(query)
    .limit(limit)
    .skip(skip)
    .populate('userId', 'name avatar email')
    .sort({ rating: -1 });

  const total = await Freelancer.countDocuments(query);

  return {
    freelancers,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

const getTrendingSkills = async () => {
  const skills = await Gig.aggregate([
    { $unwind: '$requiredSkills' },
    { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return skills;
};

const getCategories = async () => {
  const categories = await Gig.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return categories;
};

export {
  searchGigs,
  searchFreelancers,
  getTrendingSkills,
  getCategories,
};