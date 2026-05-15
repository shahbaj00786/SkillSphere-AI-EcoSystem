import * as chatService from '../services/chat.service.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const sendMessageController = async (req, res, next) => {
  try {
    const { receiverId, content, attachments, gigId } = req.body;
    const message = await chatService.sendMessageService(
      req.user.id,
      receiverId,
      content,
      attachments,
      gigId
    );
    res.status(201).json(apiResponse(201, message, 'Message sent successfully'));
  } catch (error) {
    next(error);
  }
};

const getConversationController = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const messages = await chatService.getConversationService(
      req.user.id,
      otherUserId,
      parseInt(page),
      parseInt(limit)
    );
    res.status(200).json(apiResponse(200, messages, 'Conversation retrieved'));
  } catch (error) {
    next(error);
  }
};

const getUserConversationsController = async (req, res, next) => {
  try {
    const conversations = await chatService.getUserConversationsService(req.user.id);
    res.status(200).json(apiResponse(200, conversations, 'Conversations retrieved'));
  } catch (error) {
    next(error);
  }
};

const markAsReadController = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await chatService.markMessageAsReadService(messageId);
    res.status(200).json(apiResponse(200, message, 'Message marked as read'));
  } catch (error) {
    next(error);
  }
};

const deleteMessageController = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    await chatService.deleteMessageService(messageId, req.user.id);
    res.status(200).json(apiResponse(200, {}, 'Message deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export {
  sendMessageController,
  getConversationController,
  getUserConversationsController,
  markAsReadController,
  deleteMessageController,
};