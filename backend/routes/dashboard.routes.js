const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { sequelize, Courrier, User, Service, Notification } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
router.get('/stats', protect, authorize('admin', 'agent_bo', 'secretaire_general'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total courriers
    const totalCourriers = await Courrier.count();
    
    // Courriers by status
    const courriersByStatus = await Courrier.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status']
    });

    // Courriers this month
    const courriersThisMonth = await Courrier.count({
      where: { createdAt: { [Op.gte]: startOfMonth } }
    });

    // Pending courriers
    const pendingCourriers = await Courrier.count({
      where: { status: { [Op.in]: ['recu', 'enregistre', 'affecte', 'en_cours'] } }
    });

    // Processed courriers
    const processedCourriers = await Courrier.count({
      where: { status: { [Op.in]: ['traite', 'transmis', 'archive'] } }
    });

    // Average processing time (simplified for SQLite compatibility)
    let avgProcessingTime = 0;
    const processedWithDates = await Courrier.findAll({
      where: { dateTraitement: { [Op.not]: null } },
      attributes: ['dateReception', 'dateTraitement']
    });
    if (processedWithDates.length > 0) {
      const totalDays = processedWithDates.reduce((sum, c) => {
        const diff = (new Date(c.dateTraitement) - new Date(c.dateReception)) / (1000 * 60 * 60 * 24);
        return sum + diff;
      }, 0);
      avgProcessingTime = Math.round(totalDays / processedWithDates.length);
    }

    // Urgent courriers
    const urgentCourriers = await Courrier.count({
      where: { 
        priorite: 'urgente',
        status: { [Op.notIn]: ['traite', 'transmis', 'archive'] }
      }
    });

    // Users count
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });

    // Services count
    const totalServices = await Service.count({ where: { isActive: true } });

    res.json({
      success: true,
      data: {
        totalCourriers,
        courriersThisMonth,
        pendingCourriers,
        processedCourriers,
        urgentCourriers,
        avgProcessingTime,
        courriersByStatus: courriersByStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.dataValues.count);
          return acc;
        }, {}),
        totalUsers,
        activeUsers,
        totalServices
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/dashboard/recent
// @desc    Get recent courriers
router.get('/recent', protect, authorize('admin', 'agent_bo', 'secretaire_general'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const courriers = await Courrier.findAll({
      include: [
        { model: User, as: 'expediteur', attributes: ['firstName', 'lastName'] },
        { model: Service, as: 'serviceDestinataire', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });

    res.json({ success: true, data: courriers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// @route   GET /api/dashboard/by-service
// @desc    Get courriers grouped by service
router.get('/by-service', protect, authorize('admin', 'secretaire_general'), async (req, res) => {
  try {
    const stats = await Courrier.findAll({
      attributes: [
        'destinataireServiceId',
        [sequelize.fn('COUNT', sequelize.col('Courrier.id')), 'total'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status IN ('traite', 'transmis', 'archive') THEN 1 ELSE 0 END")), 'traites'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status NOT IN ('traite', 'transmis', 'archive') THEN 1 ELSE 0 END")), 'enAttente']
      ],
      include: [{ model: Service, as: 'serviceDestinataire', attributes: ['name', 'code'] }],
      group: ['destinataireServiceId', 'serviceDestinataire.id'],
      having: sequelize.literal('destinataire_service_id IS NOT NULL')
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
