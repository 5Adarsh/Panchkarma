const express = require('express');
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All client routes require authentication and CLIENT role
router.use(authMiddleware);
router.use(roleMiddleware('CLIENT'));

router.get('/dashboard', clientController.getDashboard);
router.get('/appointments', clientController.getAppointments);
router.get('/book-therapy', clientController.getBookTherapy);
router.post('/book-therapy', clientController.postBookTherapy);
router.get('/dosha-tracker', clientController.getDoshaTracker);
router.get('/profile', clientController.getProfile);
router.post('/profile', clientController.updateProfile);

module.exports = router;
