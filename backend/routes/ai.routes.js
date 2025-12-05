const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { analyzeCourrier, suggestService } = require('../services/aiService');
const { checkAndSendReminders } = require('../services/reminderService');

// @route   POST /api/ai/analyze
// @desc    Analyze courrier content and suggest service (all authenticated users can view)
router.post('/analyze', protect, async (req, res) => {
  try {
    const { objet, contenu } = req.body;

    if (!objet && !contenu) {
      return res.status(400).json({
        success: false,
        message: 'Objet ou contenu requis pour l\'analyse'
      });
    }

    const analysis = await analyzeCourrier(objet || '', contenu || '');

    res.json({
      success: true,
      data: {
        suggestedService: analysis.suggestion.service,
        suggestedServiceId: analysis.suggestion.serviceId,
        confidence: analysis.suggestion.confidence,
        category: analysis.suggestion.category,
        detectedPriority: analysis.detectedPriority,
        keywords: analysis.keywords,
        reason: analysis.suggestion.reason
      }
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ success: false, message: 'Erreur d\'analyse' });
  }
});

// @route   POST /api/ai/suggest-service
// @desc    Quick service suggestion
router.post('/suggest-service', protect, async (req, res) => {
  try {
    const { objet, contenu } = req.body;
    const suggestion = await suggestService(objet || '', contenu || '');

    res.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ success: false, message: 'Erreur de suggestion' });
  }
});

// @route   POST /api/ai/check-reminders
// @desc    Manually trigger reminder check (admin only)
router.post('/check-reminders', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await checkAndSendReminders();
    res.json({
      success: true,
      message: 'Vérification des rappels effectuée',
      data: result
    });
  } catch (error) {
    console.error('Reminder check error:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la vérification' });
  }
});

module.exports = router;
