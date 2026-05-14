import express from 'express';
import {
  createGigController,
  getGigController,
  getClientGigsController,
  getAllGigsController,
  updateGigController,
  deleteGigController,
  searchGigController,
} from '../controllers/gig.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, createGigController);
router.get('/all', getAllGigsController);
router.get('/my-gigs', auth, getClientGigsController);
router.get('/search', searchGigController);
router.get('/:id', getGigController);
router.put('/:id', auth, updateGigController);
router.delete('/:id', auth, deleteGigController);

export default router;