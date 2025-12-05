const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Code court du service'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  chefId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'chef_id',
    comment: 'ID du chef de service'
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mots-clés pour suggestion IA (séparés par virgule)',
    get() {
      const rawValue = this.getDataValue('keywords');
      return rawValue ? rawValue.split(',').map(k => k.trim()) : [];
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('keywords', value.join(','));
      } else {
        this.setDataValue('keywords', value);
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'services'
});

module.exports = Service;
