const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Service, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/services
// @desc    Get all services
router.get('/', protect, async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      include: [{ model: User, as: 'chef', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['name', 'ASC']]
    });

    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service
router.get('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        { model: User, as: 'chef', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'membres', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] }
      ]
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/services
// @desc    Create service (admin only)
router.post('/', protect, authorize('admin'), [
  body('name').notEmpty().withMessage('Nom requis'),
  body('code').notEmpty().withMessage('Code requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, code, description, email, phone, chefId, keywords } = req.body;

    const service = await Service.create({
      name, code, description, email, phone, chefId, keywords
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    const { name, code, description, email, phone, chefId, keywords, isActive } = req.body;

    await service.update({
      name: name || service.name,
      code: code || service.code,
      description: description !== undefined ? description : service.description,
      email: email !== undefined ? email : service.email,
      phone: phone !== undefined ? phone : service.phone,
      chefId: chefId !== undefined ? chefId : service.chefId,
      keywords: keywords !== undefined ? keywords : service.getDataValue('keywords'),
      isActive: isActive !== undefined ? isActive : service.isActive
    });

    res.json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé' });
    }

    await service.update({ isActive: false });
    res.json({ success: true, message: 'Service désactivé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
