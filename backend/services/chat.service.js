import * as messageRepo from '../repositories/message.repo.js';

const sendMessageService = async (senderId, receiverId, content, attachments = [], gigId = null) => {
  const data = {
    senderId,
    receiverId,
    content,
    attachments,
    gigId,
  };
  return await messageRepo.createMessage(data);
};

const getConversationService = async (userId, otherUserId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const messages = await messageRepo.findConversation(userId, otherUserId, limit, skip);
  return messages.reverse();
};

const getUserConversationsService = async (userId) => {
  return await messageRepo.findUserConversations(userId);
};

const markMessageAsReadService = async (messageId) => {
  return await messageRepo.markAsRead(messageId);
};

const deleteMessageService = async (messageId, userId) => {
  const message = await messageRepo.findMessageById(messageId);
  if (!message || message.senderId.toString() !== userId) {
    throw new Error('Unauthorized');
  }
  return await messageRepo.deleteMessage(messageId);
};

export {
  sendMessageService,
  getConversationService,
  getUserConversationsService,
  markMessageAsReadService,
  deleteMessageService,
};