const Notification = require('../models/Notification');

// Helper: Create notification
const createNotification = async (userId, type, titre, message, courrierId = null) => {
  try {
    await Notification.create({ userId, type, titre, message, courrierId });
    console.log(`Notification created for user ${userId}: ${titre}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { createNotification };
