import * as chatService from '../services/chat.service.js';

const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    // User joins chat room
    socket.on('join-room', (userId) => {
      socket.join(`user-${userId}`);
    });

    // Send message via socket
    socket.on('send-message', async (data) => {
      try {
        const { senderId, receiverId, content, attachments, gigId } = data;
        const message = await chatService.sendMessageService(
          senderId,
          receiverId,
          content,
          attachments,
          gigId
        );

        // Emit to receiver
        io.to(`user-${receiverId}`).emit('receive-message', {
          ...message.toObject(),
          senderInfo: {
            id: senderId,
            name: data.senderName,
            avatar: data.senderAvatar,
          },
        });

        // Emit back to sender for confirmation
        socket.emit('message-sent', message);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { senderId, receiverId } = data;
      io.to(`user-${receiverId}`).emit('user-typing', {
        userId: senderId,
        isTyping: true,
      });
    });

    socket.on('stop-typing', (data) => {
      const { senderId, receiverId } = data;
      io.to(`user-${receiverId}`).emit('user-typing', {
        userId: senderId,
        isTyping: false,
      });
    });

    // Mark message as read
    socket.on('mark-read', async (messageId) => {
      try {
        await chatService.markMessageAsReadService(messageId);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // User disconnects
    socket.on('disconnect', () => {
      // Handle disconnect if needed
    });
  });
};

export default setupChatSocket;