import * as notificationRepo from '../repositories/notification.repo.js';

const createNotificationService = async (data) => {
  return await notificationRepo.createNotification(data);
};

const getUserNotificationsService = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const notifications = await notificationRepo.findUserNotifications(userId, limit, skip);
  const total = await notificationRepo.getUnreadCount(userId);

  return {
    notifications,
    unreadCount: total,
  };
};

const getUnreadNotificationsService = async (userId) => {
  return await notificationRepo.findUnreadNotifications(userId);
};

const markNotificationAsReadService = async (notificationId) => {
  return await notificationRepo.markAsRead(notificationId);
};

const markAllNotificationsAsReadService = async (userId) => {
  return await notificationRepo.markAllAsRead(userId);
};

const deleteNotificationService = async (notificationId) => {
  return await notificationRepo.deleteNotification(notificationId);
};

const deleteAllUserNotificationsService = async (userId) => {
  return await notificationRepo.deleteUserNotifications(userId);
};

const getUnreadCountService = async (userId) => {
  return await notificationRepo.getUnreadCount(userId);
};

export {
  createNotificationService,
  getUserNotificationsService,
  getUnreadNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
  deleteAllUserNotificationsService,
  getUnreadCountService,
};