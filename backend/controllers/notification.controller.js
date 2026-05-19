import * as notificationService from '../services/notification.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const getUserNotificationsController = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await notificationService.getUserNotificationsService(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, result, 'Notifications retrieved'));
  } catch (error) {
    next(error);
  }
};

const getUnreadNotificationsController = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUnreadNotificationsService(req.user.id);
    res.status(200).json(apiResponse(200, notifications, 'Unread notifications retrieved'));
  } catch (error) {
    next(error);
  }
};

const markAsReadController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markNotificationAsReadService(id);
    res.status(200).json(apiResponse(200, notification, 'Notification marked as read'));
  } catch (error) {
    next(error);
  }
};

const markAllAsReadController = async (req, res, next) => {
  try {
    await notificationService.markAllNotificationsAsReadService(req.user.id);
    res.status(200).json(apiResponse(200, {}, 'All notifications marked as read'));
  } catch (error) {
    next(error);
  }
};

const deleteNotificationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotificationService(id);
    res.status(200).json(apiResponse(200, {}, 'Notification deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteAllNotificationsController = async (req, res, next) => {
  try {
    await notificationService.deleteAllUserNotificationsService(req.user.id);
    res.status(200).json(apiResponse(200, {}, 'All notifications deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const getUnreadCountController = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCountService(req.user.id);
    res.status(200).json(apiResponse(200, { unreadCount: count }, 'Unread count retrieved'));
  } catch (error) {
    next(error);
  }
};

export {
  getUserNotificationsController,
  getUnreadNotificationsController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
  deleteAllNotificationsController,
  getUnreadCountController,
};