import {
  setupFreelancerProfile,
  updateFreelancerProfile,
  getAllFreelancerProfiles,
  addPortfolio,
  removePortfolio,
  uploadResume,
  updateFreelancerAvailability,
} from '../services/user.service.js';

// setup freelancer profile
const setupProfile = async (req, res) => {
  try {
    const result = await setupFreelancerProfile(req.userId, req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update freelancer profile
const updateProfile = async (req, res) => {
  try {
    const result = await updateFreelancerProfile(req.userId, req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get all freelancers
const getAllFreelancers = async (req, res) => {
  try {
    const result = await getAllFreelancerProfiles();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// add portfolio item
const addPortfolioItem = async (req, res) => {
  try {
    const result = await addPortfolio(req.userId, req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// remove portfolio item
const removePortfolioItem = async (req, res) => {
  try {
    const result = await removePortfolio(req.userId, req.params.itemId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// upload resume
const uploadResumeController = async (req, res) => {
  try {
    const result = await uploadResume(req.userId, req.file);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update availability
const updateAvailability = async (req, res) => {
  try {
    const result = await updateFreelancerAvailability(req.userId, req.body.slots);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  setupProfile,
  updateProfile,
  getAllFreelancers,
  addPortfolioItem,
  removePortfolioItem,
  uploadResumeController,
  updateAvailability,
};