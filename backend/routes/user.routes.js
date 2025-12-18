const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User, Service, Courrier, CourrierHistory, Notification, VideoAssistance } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, serviceId, isActive } = req.query;
    const where = {};

    if (role) where.role = role;
    if (serviceId) where.serviceId = serviceId;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const users = await User.findAll({
      where,
      include: [{ model: Service, as: 'service' }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Service, as: 'service' }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/users
// @desc    Create user (admin only)
router.post('/', protect, authorize('admin'), [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('role').isIn(['citoyen', 'agent_bo', 'chef_service', 'secretaire_general', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, cin, role, serviceId } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    const user = await User.create({
      email, password, firstName, lastName, phone, cin, role, serviceId
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const { firstName, lastName, phone, role, serviceId, isActive } = req.body;

    // Convert empty string to null for serviceId (foreign key constraint)
    const cleanServiceId = serviceId === '' ? null : (serviceId || user.serviceId);

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone !== undefined ? phone : user.phone,
      role: role || user.role,
      serviceId: cleanServiceId,
      isActive: isActive !== undefined ? isActive : user.isActive
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const userId = req.params.id;

    // Nettoyer les références avant suppression
    await Courrier.update({ expediteurId: null }, { where: { expediteurId: userId } });
    await Courrier.update({ agentBoId: null }, { where: { agentBoId: userId } });
    await Courrier.update({ traitePar: null }, { where: { traitePar: userId } });
    await CourrierHistory.update({ userId: null }, { where: { userId: userId } });
    await Service.update({ chefId: null }, { where: { chefId: userId } });
    await VideoAssistance.update({ citizenId: null }, { where: { citizenId: userId } });
    await VideoAssistance.update({ agentId: null }, { where: { agentId: userId } });
    await Notification.destroy({ where: { userId: userId } });

    await user.destroy();
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
