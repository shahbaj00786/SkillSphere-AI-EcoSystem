import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from '../services/auth.service.js';

// register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// verify email
const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyEmail(token);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// logout
const logout = async (req, res) => {
  try {
    const result = await logoutUser(req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// forgot password
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// reset password
const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await resetPassword({ token, password });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get profile
const getProfileController = async (req, res) => {
  try {
    const result = await getProfile(req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update profile
const updateProfileController = async (req, res) => {
  try {
    const result = await updateProfile(req.userId, req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  register,
  verifyEmailController,
  login,
  refreshToken,
  logout,
  forgotPasswordController,
  resetPasswordController,
  getProfileController,
  updateProfileController,
};