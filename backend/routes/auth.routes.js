import express from 'express';
import {
  register,
  verifyEmailController,
  login,
  refreshToken,
  logout,
  forgotPasswordController,
  resetPasswordController,
  getProfileController,
  updateProfileController,
} from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = express.Router();

// public routes — no auth needed
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/verify-email', verifyEmailController);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.post('/refresh-token', refreshToken);

// protected routes — auth needed
router.post('/logout', auth, logout);
router.get('/profile', auth, getProfileController);
router.put('/profile', auth, updateProfileController);

export default router;