import express from 'express';
import {
  searchGigsController,
  searchFreelancersController,
  getTrendingSkillsController,
  getCategoriesController,
} from '../controllers/search.controller.js';

const router = express.Router();

router.get('/gigs', searchGigsController);
router.get('/freelancers', searchFreelancersController);
router.get('/trending-skills', getTrendingSkillsController);
router.get('/categories', getCategoriesController);

export default router;