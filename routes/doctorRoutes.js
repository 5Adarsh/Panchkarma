const express = require('express');
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All doctor routes require authentication and DOCTOR role
router.use(authMiddleware);
router.use(roleMiddleware('DOCTOR'));

router.get('/dashboard', doctorController.getDashboard);
router.get('/appointments', doctorController.getAppointments);
router.post('/appointments/:appointmentId/confirm', doctorController.confirmAppointment);
router.post('/appointments/:appointmentId/complete', doctorController.completeAppointment);

router.get('/patients', doctorController.getPatients);
router.get('/patient/:patientId', doctorController.getPatientDetail);

router.get('/patient/:patientId/dosha', doctorController.getDoshaForm);
router.post('/patient/:patientId/dosha', doctorController.postDoshaForm);

module.exports = router;
