import {
  findUserById,
  updateUserById,
  deleteUserById,
} from "../repositories/user.repo.js";
import {
  createFreelancer,
  findFreelancerByUserId,
  updateFreelancerByUserId,
  getAllFreelancers,
  addPortfolioItem,
  removePortfolioItem,
  updateAvailability,
} from "../repositories/freelancer.repo.js";
import {
  createClient,
  findClientByUserId,
  updateClientByUserId,
  getAllClients,
} from "../repositories/client.repo.js";
import { v2 as cloudinary } from "cloudinary";

// get user profile with role data
const getUserProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  let roleData = null;
  if (user.role === "freelancer") {
    roleData = await findFreelancerByUserId(userId);
  } else if (user.role === "client") {
    roleData = await findClientByUserId(userId);
  }

  user.password = undefined;
  user.refreshToken = undefined;
  user.twoFASecret = undefined;

  return { success: true, user, roleData };
};

// update basic user profile
const updateUserProfile = async (userId, updateData) => {
  const user = await updateUserById(userId, updateData);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  user.password = undefined;
  user.refreshToken = undefined;

  return { success: true, message: "Profile updated successfully", user };
};

// upload avatar
const uploadAvatar = async (userId, file) => {
  if (!file) {
    return { success: false, message: "No file uploaded" };
  }

  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
    folder: "skillsphere/avatars",
  });

  const user = await updateUserById(userId, { avatar: result.secure_url });
  user.password = undefined;

  return {
    success: true,
    message: "Avatar uploaded successfully",
    avatar: result.secure_url,
  };
};

// delete account
const deleteAccount = async (userId) => {
  await deleteUserById(userId);
  return { success: true, message: "Account deleted successfully" };
};

// ─── FREELANCER SERVICES ─────

// setup freelancer profile (called after register)
const setupFreelancerProfile = async (userId, data) => {
  const existing = await findFreelancerByUserId(userId);
  if (existing) {
    return { success: false, message: "Freelancer profile already exists" };
  }

  const freelancer = await createFreelancer({ userId, ...data });
  return { success: true, message: "Freelancer profile created", freelancer };
};

// update freelancer profile
const updateFreelancerProfile = async (userId, data) => {
  const freelancer = await updateFreelancerByUserId(userId, data);
  if (!freelancer) {
    return { success: false, message: "Freelancer profile not found" };
  }
  return { success: true, message: "Profile updated successfully", freelancer };
};

// get all freelancers
const getAllFreelancerProfiles = async () => {
  const freelancers = await getAllFreelancers();
  return { success: true, freelancers };
};

// add portfolio item
const addPortfolio = async (userId, item) => {
  const freelancer = await addPortfolioItem(userId, item);
  return { success: true, message: "Portfolio item added", freelancer };
};

// remove portfolio item
const removePortfolio = async (userId, itemId) => {
  const freelancer = await removePortfolioItem(userId, itemId);
  return { success: true, message: "Portfolio item removed", freelancer };
};

// upload resume
const uploadResume = async (userId, file) => {
  if (!file) {
    return { success: false, message: "No file uploaded" };
  }

  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
    folder: "skillsphere/resumes",
  });

  const freelancer = await updateFreelancerByUserId(userId, {
    resumeUrl: result.secure_url,
  });
  return {
    success: true,
    message: "Resume uploaded successfully",
    resumeUrl: result.secure_url,
  };
};

// update availability
const updateFreelancerAvailability = async (userId, slots) => {
  const freelancer = await updateAvailability(userId, slots);
  return { success: true, message: "Availability updated", freelancer };
};

// ─── CLIENT SERVICES ────

// setup client profile
const setupClientProfile = async (userId, data) => {
  const existing = await findClientByUserId(userId);
  if (existing) {
    return { success: false, message: "Client profile already exists" };
  }

  const client = await createClient({ userId, ...data });
  return { success: true, message: "Client profile created", client };
};

// update client profile
const updateClientProfile = async (userId, data) => {
  const client = await updateClientByUserId(userId, data);
  if (!client) {
    return { success: false, message: "Client profile not found" };
  }
  return { success: true, message: "Profile updated successfully", client };
};

export {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteAccount,
  setupFreelancerProfile,
  updateFreelancerProfile,
  getAllFreelancerProfiles,
  addPortfolio,
  removePortfolio,
  uploadResume,
  updateFreelancerAvailability,
  setupClientProfile,
  updateClientProfile,
};
