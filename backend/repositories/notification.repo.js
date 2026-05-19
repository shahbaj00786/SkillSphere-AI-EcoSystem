import Notification from '../models/Notification.model.js';

const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

const findNotificationById = async (id) => {
  return await Notification.findById(id);
};

const findUserNotifications = async (userId, limit = 20, skip = 0) => {
  return await Notification.find({ userId })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
};

const findUnreadNotifications = async (userId) => {
  return await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
};

const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(id);
};

const deleteUserNotifications = async (userId) => {
  return await Notification.deleteMany({ userId });
};

const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, isRead: false });
};

export {
  createNotification,
  findNotificationById,
  findUserNotifications,
  findUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteUserNotifications,
  getUnreadCount,
};