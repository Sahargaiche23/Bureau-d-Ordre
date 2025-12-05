const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Courrier = sequelize.define('Courrier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('entrant', 'sortant', 'interne'),
    defaultValue: 'entrant'
  },
  objet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expediteurId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'expediteur_id'
  },
  expediteurExterne: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'expediteur_externe'
  },
  destinataireServiceId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'destinataire_service_id'
  },
  status: {
    type: DataTypes.ENUM('recu', 'enregistre', 'affecte', 'en_cours', 'traite', 'transmis', 'archive', 'rejete'),
    defaultValue: 'recu'
  },
  priorite: {
    type: DataTypes.ENUM('basse', 'normale', 'haute', 'urgente'),
    defaultValue: 'normale'
  },
  dateReception: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    field: 'date_reception'
  },
  dateEcheance: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_echeance'
  },
  dateTraitement: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'date_traitement'
  },
  agentBoId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'agent_bo_id'
  },
  traitePar: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'traite_par'
  },
  reponse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fichierPath: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'fichier_path'
  },
  fichierReponsePath: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'fichier_reponse_path'
  },
  motsCles: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'mots_cles'
  },
  serviceSuggere: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'service_suggere'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'courriers'
});

// Use beforeValidate to set reference before validation runs
Courrier.beforeValidate(async (courrier) => {
  if (!courrier.reference) {
    const year = new Date().getFullYear();
    const count = await Courrier.count() + 1;
    courrier.reference = `BO-${year}-${String(count).padStart(5, '0')}`;
  }
});

module.exports = Courrier;
