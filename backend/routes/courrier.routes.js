const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Courrier, User, Service, CourrierHistory, Notification } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { notifyCitizenOnComplete } = require('../services/reminderService');
const { sendEmail } = require('../services/emailService');

// Helper: Create history entry
const addHistory = async (courrierId, userId, action, ancienStatus, nouveauStatus, commentaire = null) => {
  await CourrierHistory.create({
    courrierId, userId, action, ancienStatus, nouveauStatus, commentaire
  });
};

// Helper: Create notification
const createNotification = async (userId, type, titre, message, courrierId = null) => {
  await Notification.create({ userId, type, titre, message, courrierId });
};

// @route   GET /api/courriers
// @desc    Get courriers based on user role
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, priorite, serviceId, dateFrom, dateTo, search } = req.query;
    const where = {};

    // Filter by role
    if (req.user.role === 'citoyen') {
      where.expediteurId = req.user.id;
    } else if (req.user.role === 'chef_service') {
      where.destinataireServiceId = req.user.serviceId;
    }

    // Additional filters
    if (status) where.status = status;
    if (type) where.type = type;
    if (priorite) where.priorite = priorite;
    if (serviceId) where.destinataireServiceId = serviceId;
    if (dateFrom || dateTo) {
      where.dateReception = {};
      if (dateFrom) where.dateReception[Op.gte] = dateFrom;
      if (dateTo) where.dateReception[Op.lte] = dateTo;
    }
    if (search) {
      where[Op.or] = [
        { reference: { [Op.like]: `%${search}%` } },
        { objet: { [Op.like]: `%${search}%` } }
      ];
    }

    const courriers = await Courrier.findAll({
      where,
      include: [
        { model: User, as: 'expediteur', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Service, as: 'serviceDestinataire' },
        { model: User, as: 'agentBo', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'traiteur', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: courriers.length, data: courriers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/courriers/:id
// @desc    Get single courrier with history
router.get('/:id', protect, async (req, res) => {
  try {
    const courrier = await Courrier.findByPk(req.params.id, {
      include: [
        { model: User, as: 'expediteur', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Service, as: 'serviceDestinataire' },
        { model: User, as: 'agentBo', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'traiteur', attributes: ['id', 'firstName', 'lastName'] },
        { model: Service, as: 'suggestionIa' },
        { 
          model: CourrierHistory, 
          as: 'historique',
          include: [{ model: User, as: 'utilisateur', attributes: ['id', 'firstName', 'lastName'] }],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!courrier) {
      return res.status(404).json({ success: false, message: 'Courrier non trouvé' });
    }

    // Check access
    if (req.user.role === 'citoyen' && courrier.expediteurId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });
    }

    res.json({ success: true, data: courrier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/courriers
// @desc    Create courrier (citoyen submits request)
router.post('/', protect, upload.single('fichier'), [
  body('objet').notEmpty().withMessage('Objet requis'),
  body('contenu').notEmpty().withMessage('Contenu requis')
], async (req, res) => {
  console.log('=== CREATE COURRIER REQUEST ===');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  console.log('User:', req.user?.id, req.user?.role);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { objet, contenu, type, priorite, destinataireServiceId } = req.body;

    const courrier = await Courrier.create({
      objet,
      contenu,
      type: type || 'entrant',
      priorite: priorite || 'normale',
      expediteurId: req.user.role === 'citoyen' ? req.user.id : null,
      expediteurExterne: req.user.role !== 'citoyen' ? req.body.expediteurExterne : null,
      destinataireServiceId,
      fichierPath: req.file ? req.file.path : null,
      status: 'recu'
    });

    await addHistory(courrier.id, req.user.id, 'creation', null, 'recu', 'Courrier créé');

    res.status(201).json({ success: true, data: courrier });
  } catch (error) {
    console.error('=== ERREUR CREATION COURRIER ===');
    console.error(error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
  }
});

// @route   PUT /api/courriers/:id/affecter
// @desc    Assign courrier to service (Agent BO)
router.put('/:id/affecter', protect, authorize('agent_bo', 'admin'), async (req, res) => {
  try {
    const { serviceId, notes } = req.body;
    const courrier = await Courrier.findByPk(req.params.id);

    if (!courrier) {
      return res.status(404).json({ success: false, message: 'Courrier non trouvé' });
    }

    const ancienStatus = courrier.status;
    await courrier.update({
      destinataireServiceId: serviceId,
      status: 'affecte',
      agentBoId: req.user.id,
      notes: notes || courrier.notes
    });

    await addHistory(courrier.id, req.user.id, 'affectation', ancienStatus, 'affecte', `Affecté au service`);

    // Notify chef de service
    const service = await Service.findByPk(serviceId);
    if (service && service.chefId) {
      await createNotification(
        service.chefId,
        'affectation',
        'Nouveau courrier affecté',
        `Le courrier ${courrier.reference} a été affecté à votre service`,
        courrier.id
      );
    }

    res.json({ success: true, data: courrier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/courriers/:id/traiter
// @desc    Process courrier (Chef de service)
router.put('/:id/traiter', protect, authorize('chef_service', 'agent_bo', 'admin'), upload.single('fichierReponse'), async (req, res) => {
  try {
    const { reponse, status } = req.body;
    const courrier = await Courrier.findByPk(req.params.id);

    if (!courrier) {
      return res.status(404).json({ success: false, message: 'Courrier non trouvé' });
    }

    const ancienStatus = courrier.status;
    const newStatus = status || 'traite';

    await courrier.update({
      reponse,
      status: newStatus,
      traitePar: req.user.id,
      dateTraitement: new Date(),
      fichierReponsePath: req.file ? req.file.path : courrier.fichierReponsePath
    });

    await addHistory(courrier.id, req.user.id, 'traitement', ancienStatus, newStatus, reponse);

    // Notify citoyen (in-app + email)
    if (courrier.expediteurId) {
      await createNotification(
        courrier.expediteurId,
        'traitement',
        'Votre demande a été traitée',
        `Le courrier ${courrier.reference} a été traité`,
        courrier.id
      );
      
      // Send email notification
      await notifyCitizenOnComplete(courrier);
    }

    res.json({ success: true, data: courrier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/courriers/:id/rappel
// @desc    Send reminder (Agent BO)
router.put('/:id/rappel', protect, authorize('agent_bo', 'admin'), async (req, res) => {
  try {
    const courrier = await Courrier.findByPk(req.params.id, {
      include: [{ model: Service, as: 'serviceDestinataire' }]
    });

    if (!courrier) {
      return res.status(404).json({ success: false, message: 'Courrier non trouvé' });
    }

    await addHistory(courrier.id, req.user.id, 'rappel', courrier.status, courrier.status, req.body.message || 'Rappel envoyé');

    // Notify chef de service
    if (courrier.serviceDestinataire && courrier.serviceDestinataire.chefId) {
      await createNotification(
        courrier.serviceDestinataire.chefId,
        'rappel',
        'Rappel: Courrier en attente',
        `Le courrier ${courrier.reference} nécessite votre attention`,
        courrier.id
      );
    }

    res.json({ success: true, message: 'Rappel envoyé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/courriers/suivi/:reference
// @desc    Track courrier by reference (public)
router.get('/suivi/:reference', async (req, res) => {
  try {
    const courrier = await Courrier.findOne({
      where: { reference: req.params.reference },
      attributes: ['id', 'reference', 'objet', 'status', 'dateReception', 'dateTraitement', 'createdAt'],
      include: [
        { model: Service, as: 'serviceDestinataire', attributes: ['name'] },
        {
          model: CourrierHistory,
          as: 'historique',
          attributes: ['action', 'createdAt'],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!courrier) {
      return res.status(404).json({ success: false, message: 'Courrier non trouvé' });
    }

    res.json({ success: true, data: courrier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
