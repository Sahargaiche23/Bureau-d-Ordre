const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const VideoAssistance = require('../models/VideoAssistance');
const User = require('../models/User');
const { createNotification } = require('./notification.routes');

// @route   GET /api/assistance
// @desc    Get all assistance requests
router.get('/', protect, async (req, res) => {
  try {
    let whereClause = {};
    
    // Citizens see only their requests
    if (req.user.role === 'citoyen') {
      whereClause.citizenId = req.user.id;
    }
    
    const requests = await VideoAssistance.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'citizen', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: User, as: 'agent', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching assistance requests:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   POST /api/assistance
// @desc    Create assistance request (citizen only)
router.post('/', protect, async (req, res) => {
  try {
    const { subject, description, preferredDate, preferredTime } = req.body;
    
    const request = await VideoAssistance.create({
      citizenId: req.user.id,
      subject,
      description,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      roomId: `assist-${Date.now()}`
    });
    
    // Notify agents about new request
    const agents = await User.findAll({
      where: { role: 'agent_bo', isActive: true }
    });
    
    for (const agent of agents) {
      await createNotification(
        agent.id,
        'assistance',
        '📹 Nouvelle demande d\'assistance vidéo',
        `${req.user.firstName} ${req.user.lastName} demande une assistance vidéo: ${subject}`,
        null
      );
    }
    
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error('Error creating assistance request:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/assistance/:id/start
// @desc    Start a video call (agent)
router.put('/:id/start', protect, authorize('agent_bo', 'admin', 'chef_service'), async (req, res) => {
  try {
    const request = await VideoAssistance.findByPk(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }
    
    await request.update({
      status: 'in_progress',
      agentId: req.user.id,
      startedAt: new Date()
    });
    
    // Notify citizen
    await createNotification(
      request.citizenId,
      'assistance',
      '📹 Votre appel vidéo démarre!',
      `Un agent est prêt pour votre assistance. Cliquez pour rejoindre l'appel.`,
      null
    );
    
    res.json({ success: true, data: request, roomId: request.roomId });
  } catch (error) {
    console.error('Error starting call:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/assistance/:id/end
// @desc    End a video call
router.put('/:id/end', protect, async (req, res) => {
  try {
    const request = await VideoAssistance.findByPk(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }
    
    await request.update({
      status: 'completed',
      endedAt: new Date(),
      notes: req.body.notes || null
    });
    
    // Notify citizen about completion
    await createNotification(
      request.citizenId,
      'assistance',
      '✅ Assistance vidéo terminée',
      `Votre session d'assistance vidéo est terminée. Merci de votre confiance!`,
      null
    );
    
    res.json({ success: true, data: request });
  } catch (error) {
    console.error('Error ending call:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   PUT /api/assistance/:id/rate
// @desc    Rate the assistance (citizen)
router.put('/:id/rate', protect, async (req, res) => {
  try {
    const request = await VideoAssistance.findByPk(req.params.id);
    
    if (!request || request.citizenId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }
    
    await request.update({
      rating: req.body.rating
    });
    
    res.json({ success: true, data: request });
  } catch (error) {
    console.error('Error rating assistance:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/assistance/:id
// @desc    Cancel assistance request
router.delete('/:id', protect, async (req, res) => {
  try {
    const request = await VideoAssistance.findByPk(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }
    
    // Only creator or admin can cancel
    if (request.citizenId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }
    
    await request.update({ status: 'cancelled' });
    
    res.json({ success: true, message: 'Demande annulée' });
  } catch (error) {
    console.error('Error cancelling assistance:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
