import userModel from '../models/User.model.js';

const createUser = async (userData) => {
  const user = new userModel(userData);
  return await user.save();
};

const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

const findUserById = async (id) => {
  return await userModel.findById(id);
};

const findUserByVerificationToken = async (token) => {
  return await userModel.findOne({ verificationToken: token });
};

const findUserByResetToken = async (token) => {
  return await userModel.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
};

const findUserByRefreshToken = async (token) => {
  return await userModel.findOne({ refreshToken: token });
};

const updateUserById = async (id, updateData) => {
  return await userModel.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUserById = async (id) => {
  return await userModel.findByIdAndDelete(id);
};

const findAllUsers = async () => {
  return await userModel.find({}).select('-password -refreshToken -resetToken -twoFASecret');
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByVerificationToken,
  findUserByResetToken,
  findUserByRefreshToken,
  updateUserById,
  deleteUserById,
  findAllUsers,
};