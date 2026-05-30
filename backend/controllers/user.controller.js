import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteAccount,
} from '../services/user.service.js';

// get my profile
const getMyProfile = async (req, res) => {
  try {
    const result = await getUserProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update my profile
const updateMyProfile = async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// upload avatar
const uploadAvatarController = async (req, res) => {
  try {
    const result = await uploadAvatar(req.user.id, req.file);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// delete account
const deleteAccountController = async (req, res) => {
  try {
    const result = await deleteAccount(req.user.id);
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