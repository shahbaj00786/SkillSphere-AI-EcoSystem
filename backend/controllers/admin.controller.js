import * as adminService from '../services/admin.service.js';
import  apiResponse  from '../utils/apiResponse.utils.js';

const getAllUsersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await adminService.getAllUsersService(parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, users, 'All users retrieved'));
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserByIdService(id);
    res.status(200).json(apiResponse(200, user, 'User retrieved'));
  } catch (error) {
    next(error);
  }
};

const suspendUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await adminService.suspendUserService(id, req.user.id, reason);
    res.status(200).json(apiResponse(200, user, 'User suspended'));
  } catch (error) {
    next(error);
  }
};

const activateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.activateUserService(id, req.user.id);
    res.status(200).json(apiResponse(200, user, 'User activated'));
  } catch (error) {
    next(error);
  }
};

const verifyFreelancerController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.verifyFreelancerService(id, req.user.id);
    res.status(200).json(apiResponse(200, user, 'Freelancer verified'));
  } catch (error) {
    next(error);
  }
};

const removeGigController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const gig = await adminService.removeGigService(id, req.user.id, reason);
    res.status(200).json(apiResponse(200, gig, 'Gig removed'));
  } catch (error) {
    next(error);
  }
};

const getDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStatsService();
    res.status(200).json(apiResponse(200, stats, 'Dashboard stats retrieved'));
  } catch (error) {
    next(error);
  }
};

const getAdminLogsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const logs = await adminService.getAdminLogsService(parseInt(page), parseInt(limit));
    res.status(200).json(apiResponse(200, logs, 'Admin logs retrieved'));
  } catch (error) {
    next(error);
  }
};

const processRefundController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const payment = await adminService.processRefundService(id, req.user.id, reason);
    res.status(200).json(apiResponse(200, payment, 'Refund processed'));
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsersController,
  getUserController,
  suspendUserController,
  activateUserController,
  verifyFreelancerController,
  removeGigController,
  getDashboardStatsController,
  getAdminLogsController,
  processRefundController,
};