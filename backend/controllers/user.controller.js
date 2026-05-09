import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteAccount,
} from '../services/user.service.js';

// get my profile
const getMyProfile = async (req, res) => {
  try {
    const result = await getUserProfile(req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update my profile
const updateMyProfile = async (req, res) => {
  try {
    const result = await updateUserProfile(req.userId, req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// upload avatar
const uploadAvatarController = async (req, res) => {
  try {
    const result = await uploadAvatar(req.userId, req.file);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// delete account
const deleteAccountController = async (req, res) => {
  try {
    const result = await deleteAccount(req.userId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getMyProfile,
  updateMyProfile,
  uploadAvatarController,
  deleteAccountController,
};