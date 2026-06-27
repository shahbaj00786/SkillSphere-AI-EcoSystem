import Message from '../models/Message.model.js';
import mongoose from 'mongoose';

const createMessage = async (data) => {
  const message = new Message(data);
  return await message.save();
};

const findMessageById = async (id) => {
  return await Message.findById(id)
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar');
};

const findConversation = async (senderId, receiverId, limit = 20, skip = 0) => {
  return await Message.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  })
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

const findUserConversations = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  return await Message.aggregate([
    {
      $match: {
        $or: [{ senderId: objectId  }, { receiverId: objectId }],
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', objectId] },
            '$receiverId',
            '$senderId',
          ],
        },
        lastMessage: { $last: '$content' },
        lastMessageTime: { $last: '$createdAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $sort: { lastMessageTime: -1 },
    },
  ]);
};

const markAsRead = async (id) => {
  return await Message.findByIdAndUpdate(
    id,
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

const deleteMessage = async (id) => {
  return await Message.findByIdAndDelete(id);
};

export {
  createMessage,
  findMessageById,
  findConversation,
  findUserConversations,
  markAsRead,
  deleteMessage,
};