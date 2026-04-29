import express from 'express';
import { bookAppointment, getMyAppointments, getDoctorAppointments, 
    updateAppointmentStatus } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/doctor-appointments', protect, getDoctorAppointments);
router.patch('/:id/status', protect, updateAppointmentStatus);

export default router;