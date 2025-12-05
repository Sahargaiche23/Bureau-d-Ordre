const { sequelize } = require('../config/database');
const User = require('./User');
const Service = require('./Service');
const Courrier = require('./Courrier');
const CourrierHistory = require('./CourrierHistory');
const Notification = require('./Notification');
const VideoAssistance = require('./VideoAssistance');

// Associations
User.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
Service.hasMany(User, { foreignKey: 'serviceId', as: 'membres' });
Service.belongsTo(User, { foreignKey: 'chefId', as: 'chef' });

Courrier.belongsTo(User, { foreignKey: 'expediteurId', as: 'expediteur' });
User.hasMany(Courrier, { foreignKey: 'expediteurId', as: 'courriersEnvoyes' });

Courrier.belongsTo(Service, { foreignKey: 'destinataireServiceId', as: 'serviceDestinataire' });
Service.hasMany(Courrier, { foreignKey: 'destinataireServiceId', as: 'courriersRecus' });

Courrier.belongsTo(User, { foreignKey: 'agentBoId', as: 'agentBo' });
Courrier.belongsTo(User, { foreignKey: 'traitePar', as: 'traiteur' });
Courrier.belongsTo(Service, { foreignKey: 'serviceSuggere', as: 'suggestionIa' });

CourrierHistory.belongsTo(Courrier, { foreignKey: 'courrierId', as: 'courrier' });
Courrier.hasMany(CourrierHistory, { foreignKey: 'courrierId', as: 'historique' });
CourrierHistory.belongsTo(User, { foreignKey: 'userId', as: 'utilisateur' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'destinataire' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(Courrier, { foreignKey: 'courrierId', as: 'courrier' });

VideoAssistance.belongsTo(User, { foreignKey: 'citizenId', as: 'citizen' });
VideoAssistance.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });
User.hasMany(VideoAssistance, { foreignKey: 'citizenId', as: 'assistanceRequests' });

module.exports = { sequelize, User, Service, Courrier, CourrierHistory, Notification, VideoAssistance };
