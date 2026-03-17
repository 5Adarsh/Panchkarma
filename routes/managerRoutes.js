const express = require('express');
const managerController = require('../controllers/managerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All manager routes require authentication and MANAGER role
router.use(authMiddleware);
router.use(roleMiddleware('MANAGER'));

// Dashboard
router.get('/dashboard', managerController.getDashboard);

// Users Management
router.get('/users', managerController.getUsers);
router.post('/users', managerController.createUser);
router.put('/users/:userId', managerController.updateUser);
router.delete('/users/:userId', managerController.deleteUser);

// Therapies Management
router.get('/therapies', managerController.getTherapies);
router.post('/therapies', managerController.createTherapy);
router.put('/therapies/:therapyId', managerController.updateTherapy);
router.delete('/therapies/:therapyId', managerController.deleteTherapy);


// Appointments
router.get('/appointments', managerController.getAppointments);

// Reports
router.get('/reports', managerController.getReports);

module.exports = router;
