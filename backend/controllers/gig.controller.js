import * as gigService from '../services/gig.service.js';
import  apiResponse  from '../utils/apiResponse.utils.js';

const createGigController = async (req, res, next) => {
  try {
    const { title, description, category, budget, milestones, requiredSkills, duration } = req.body;
    const data = { clientId: req.user.id, title, description, category, budget, milestones, requiredSkills, duration };
    const gig = await gigService.createGigService(data);
    res.status(201).json(apiResponse(201, gig, 'Gig created successfully'));
  } catch (error) {
    next(error);
  }
};

const getGigController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gig = await gigService.getGigByIdService(id);
    res.status(200).json(apiResponse(200, gig, 'Gig retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getClientGigsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const gigs = await gigService.getClientGigsService(req.user.id, parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, gigs, 'Client gigs retrieved'));
  } catch (error) {
    next(error);
  }
};

const getAllGigsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const gigs = await gigService.getAllGigsService(parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, gigs, 'All gigs retrieved'));
  } catch (error) {
    next(error);
  }
};

const updateGigController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gig = await gigService.updateGigService(id, req.user.id, req.body);
    res.status(200).json(apiResponse(200, gig, 'Gig updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteGigController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await gigService.deleteGigService(id, req.user.id);
    res.status(200).json(apiResponse(200, {}, 'Gig deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const searchGigController = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const gigs = await gigService.searchGigsByCategory(category, parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, gigs, 'Gigs found'));
  } catch (error) {
    next(error);
  }
};

export {
  createGigController,
  getGigController,
  getClientGigsController,
  getAllGigsController,
  updateGigController,
  deleteGigController,
  searchGigController,
};