const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  type: {
    type: DataTypes.ENUM('nouveau_courrier', 'affectation', 'rappel', 'traitement', 'reponse', 'urgence', 'systeme'),
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  courrierId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'courrier_id'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_read'
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'read_at'
  },
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_sent'
  },
  smsSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'sms_sent'
  }
}, {
  tableName: 'notifications'
});

module.exports = Notification;
