const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CourrierHistory = sequelize.define('CourrierHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courrierId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'courrier_id'
  },
  action: {
    type: DataTypes.ENUM('creation', 'enregistrement', 'affectation', 'prise_en_charge', 'traitement', 'transmission', 'archivage', 'rejet', 'rappel', 'modification', 'commentaire'),
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  ancienStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ancien_status'
  },
  nouveauStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nouveau_status'
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'courrier_history'
});

module.exports = CourrierHistory;
