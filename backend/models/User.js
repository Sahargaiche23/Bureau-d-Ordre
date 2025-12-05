const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cin: {
    type: DataTypes.STRING(8),
    allowNull: true,
    unique: true,
    comment: 'Carte d\'identité nationale'
  },
  role: {
    type: DataTypes.ENUM('citoyen', 'agent_bo', 'chef_service', 'secretaire_general', 'admin'),
    defaultValue: 'citoyen',
    allowNull: false
  },
  serviceId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'service_id',
    comment: 'Service associé pour agent_bo et chef_service'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login'
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reset_password_token'
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reset_password_expire'
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to check password
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to get public profile
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.resetPasswordToken;
  delete values.resetPasswordExpire;
  return values;
};

module.exports = User;
