import express from 'express';
import {
  getUserNotificationsController,
  getUnreadNotificationsController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController,
  deleteAllNotificationsController,
  getUnreadCountController,
} from '../controllers/notification.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getUserNotificationsController);
router.get('/unread', auth, getUnreadNotificationsController);
router.get('/unread-count', auth, getUnreadCountController);
router.put('/:id/read', auth, markAsReadController);
router.put('/read-all', auth, markAllAsReadController);
router.delete('/:id', auth, deleteNotificationController);
router.delete('/delete-all', auth, deleteAllNotificationsController);

export default router;