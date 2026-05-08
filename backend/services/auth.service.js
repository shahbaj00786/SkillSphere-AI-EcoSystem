import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByVerificationToken,
  findUserByResetToken,
  findUserByRefreshToken,
  updateUserById,
} from '../repositories/user.repo.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils.js';
import {
  sendEmail,
  emailVerificationTemplate,
  passwordResetTemplate,
} from '../utils/email.utils.js';
import env from '../config/env.js';

// register
const registerUser = async ({ name, email, password, role }) => {
  // check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return { success: false, message: 'User already exists' };
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // create user
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
    verificationToken,
  });

  // send verification email
  const verificationUrl = `${env.clientUrl}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify Your SkillSphere Account',
    body: emailVerificationTemplate(name, verificationUrl),
  });

  return { success: true, message: 'Registration successful. Please verify your email.' };
};

// verify email
const verifyEmail = async (token) => {
  const user = await findUserByVerificationToken(token);
  if (!user) {
    return { success: false, message: 'Invalid or expired verification token' };
  }

  await updateUserById(user._id, {
    isVerified: true,
    verificationToken: null,
  });

  return { success: true, message: 'Email verified successfully' };
};

// login
const loginUser = async ({ email, password }) => {
  // check if user exists
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }

  // check if account is active
  if (!user.isActive) {
    return { success: false, message: 'Your account has been suspended' };
  }

  // check if email is verified
  if (!user.isVerified) {
    return { success: false, message: 'Please verify your email first' };
  }

  // check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { success: false, message: 'Invalid credentials' };
  }

  // check 2FA
  if (user.twoFAEnabled) {
    return { success: true, twoFARequired: true, userId: user._id };
  }

  // generate tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // save refresh token in db
  await updateUserById(user._id, {
    refreshToken,
    lastLogin: Date.now(),
  });

  // remove sensitive fields
  user.password = undefined;
  user.refreshToken = undefined;
  user.twoFASecret = undefined;

  return { success: true, accessToken, refreshToken, user };
};

// refresh token
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    return { success: false, message: 'Refresh token required' };
  }

  // verify token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return { success: false, message: 'Invalid refresh token' };
  }

  // check if token matches db
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) {
    return { success: false, message: 'Invalid refresh token' };
  }

  // generate new tokens
  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  // save new refresh token
  await updateUserById(user._id, { refreshToken: newRefreshToken });

  return { success: true, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// logout
const logoutUser = async (userId) => {
  await updateUserById(userId, { refreshToken: null });
  return { success: true, message: 'Logged out successfully' };
};

// forgot password
const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  // generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  await updateUserById(user._id, { resetToken, resetTokenExpiry });

  // send reset email
  const resetUrl = `${env.clientUrl}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: 'SkillSphere Password Reset',
    body: passwordResetTemplate(user.name, resetUrl),
  });

  return { success: true, message: 'Password reset link sent to your email' };
};

// reset password
const resetPassword = async ({ token, password }) => {
  const user = await findUserByResetToken(token);
  if (!user) {
    return { success: false, message: 'Invalid or expired reset token' };
  }

  // hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await updateUserById(user._id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpiry: null,
  });

  return { success: true, message: 'Password reset successfully' };
};

// get profile
const getProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  user.password = undefined;
  user.refreshToken = undefined;
  user.twoFASecret = undefined;

  return { success: true, user };
};

// update profile
const updateProfile = async (userId, updateData) => {
  const user = await updateUserById(userId, updateData);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  user.password = undefined;
  user.refreshToken = undefined;

  return { success: true, message: 'Profile updated successfully', user };
};

export {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};