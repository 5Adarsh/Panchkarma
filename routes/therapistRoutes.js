const express = require('express');
const therapistController = require('../controllers/therapistController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All therapist routes require authentication and THERAPIST role
router.use(authMiddleware);
router.use(roleMiddleware('THERAPIST'));

router.get('/dashboard', therapistController.getDashboard);
router.get('/today-sessions', therapistController.getTodaySessions);
router.get('/session/:sessionId', therapistController.getSessionDetail);
router.post('/session/:sessionId/complete', therapistController.completeSession);

router.get('/upcoming-appointments', therapistController.getUpcomingAppointments);

module.exports = router;
