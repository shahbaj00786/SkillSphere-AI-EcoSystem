import express from 'express';
import {
  sendMessageController,
  getConversationController,
  getUserConversationsController,
  markAsReadController,
  deleteMessageController,
} from '../controllers/chat.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send', auth, sendMessageController);
router.get('/conversation/:otherUserId', auth, getConversationController);
router.get('/conversations', auth, getUserConversationsController);
router.put('/:messageId/read', auth, markAsReadController);
router.delete('/:messageId', auth, deleteMessageController);

export default router