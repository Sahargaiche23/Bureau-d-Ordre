const express = require('express');
const router = express.Router();
const { Notification, Courrier } = require('../models');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', protect, async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const where = { userId: req.user.id };
    
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      include: [{ model: Courrier, as: 'courrier', attributes: ['id', 'reference', 'objet'] }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.id, isRead: false }
    });

    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification non trouvée' });
    }

    await notification.update({ isRead: true, readAt: new Date() });

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/notifications/test
// @desc    Create a test notification (Admin only)
router.post('/test', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const notification = await Notification.create({
      userId: req.user.id,
      type: 'systeme',
      titre: '🧪 Test de notification',
      message: 'Ceci est une notification de test. Le système fonctionne correctement!'
    });

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
