import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  uploadAvatarController,
  deleteAccountController,
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.middleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// all routes protected
router.get('/me', auth, getMyProfile);
router.put('/me', auth, updateMyProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatarController);
router.delete('/me', auth, deleteAccountController);

export default router;