import * as searchService from '../services/search.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const searchGigsController = async (req, res, next) => {
  try {
    const { location, skills, minPrice, maxPrice, category, minRating, status, page = 1, limit = 10 } = req.query;

    const filters = {
      location,
      skills: skills ? skills.split(',') : [],
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      category,
      minRating: minRating ? parseInt(minRating) : null,
      status,
    };

    const result = await searchService.searchGigs(filters, parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, result, 'Gigs found'));
  } catch (error) {
    next(error);
  }
};

const searchFreelancersController = async (req, res, next) => {
  try {
    const { location, skills, minPrice, maxPrice, category, minRating, page = 1, limit = 10 } = req.query;

    const filters = {
      location,
      skills: skills ? skills.split(',') : [],
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      category,
      minRating: minRating ? parseInt(minRating) : null,
    };

    const result = await searchService.searchFreelancers(filters, parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, result, 'Freelancers found'));
  } catch (error) {
    next(error);
  }
};

const getTrendingSkillsController = async (req, res, next) => {
  try {
    const skills = await searchService.getTrendingSkills();
    res.status(200).json(apiResponse(200, skills, 'Trending skills retrieved'));
  } catch (error) {
    next(error);
  }
};

const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await searchService.getCategories();
    res.status(200).json(apiResponse(200, categories, 'Categories retrieved'));
  } catch (error) {
    next(error);
  }
};

export {
  searchGigsController,
  searchFreelancersController,
  getTrendingSkillsController,
  getCategoriesController,
};