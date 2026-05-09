import express from 'express';
import {
  setupProfile,
  updateProfile,
  getAllFreelancers,
  addPortfolioItem,
  removePortfolioItem,
  uploadResumeController,
  updateAvailability,
} from '../controllers/freelancer.controller.js';
import auth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// public
router.get('/', getAllFreelancers);

// protected — freelancer only
router.post('/setup', auth, requireRole('freelancer'), setupProfile);
router.put('/profile', auth, requireRole('freelancer'), updateProfile);
router.post('/portfolio', auth, requireRole('freelancer'), addPortfolioItem);
router.delete('/portfolio/:itemId', auth, requireRole('freelancer'), removePortfolioItem);
router.post('/resume', auth, requireRole('freelancer'), upload.single('resume'), uploadResumeController);
router.put('/availability', auth, requireRole('freelancer'), updateAvailability);

export default router;