import * as notificationService from '../services/notification.service.js';

const setupNotificationSocket = (io) => {
  io.on('connection', (socket) => {
    // User joins notifications room
    socket.on('join-notifications', (userId) => {
      socket.join(`notifications-${userId}`);
    });

    // Send notification to user
    socket.on('send-notification', async (data) => {
      try {
        const { userId, type, title, message, relatedId, relatedModel } = data;
        
        const notification = await notificationService.createNotificationService({
          userId,
          type,
          title,
          message,
          relatedId,
          relatedModel,
        });

        // Emit to user
        io.to(`notifications-${userId}`).emit('new-notification', notification);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Mark notification as read
    socket.on('notification-read', async (notificationId) => {
      try {
        await notificationService.markNotificationAsReadService(notificationId);
        socket.emit('notification-read-confirmed', { notificationId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Get unread count
    socket.on('get-unread-count', async (userId) => {
      try {
        const count = await notificationService.getUnreadCountService(userId);
        io.to(`notifications-${userId}`).emit('unread-count', { count });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      // Handle disconnect
    });
  });
};

export default setupNotificationSocket;