import freelancerModel from '../models/Freelancer.model.js';

const createFreelancer = async (data) => {
  const freelancer = new freelancerModel(data);
  return await freelancer.save();
};

const findFreelancerByUserId = async (userId) => {
  return await freelancerModel.findOne({ userId });
};

const findFreelancerById = async (id) => {
  return await freelancerModel.findById(id);
};

const updateFreelancerByUserId = async (userId, updateData) => {
  return await freelancerModel.findOneAndUpdate({ userId }, updateData, { new: true });
};

const getAllFreelancers = async (filters = {}) => {
  return await freelancerModel.find(filters).populate('userId', 'name email avatar');
};

const addPortfolioItem = async (userId, item) => {
  return await freelancerModel.findOneAndUpdate(
    { userId },
    { $push: { portfolioItems: item } },
    { new: true }
  );
};

const removePortfolioItem = async (userId, itemId) => {
  return await freelancerModel.findOneAndUpdate(
    { userId },
    { $pull: { portfolioItems: { _id: itemId } } },
    { new: true }
  );
};

const updateAvailability = async (userId, slots) => {
  return await freelancerModel.findOneAndUpdate(
    { userId },
    { availabilitySlots: slots },
    { new: true }
  );
};

export {
  createFreelancer,
  findFreelancerByUserId,
  findFreelancerById,
  updateFreelancerByUserId,
  getAllFreelancers,
  addPortfolioItem,
  removePortfolioItem,
  updateAvailability,
};