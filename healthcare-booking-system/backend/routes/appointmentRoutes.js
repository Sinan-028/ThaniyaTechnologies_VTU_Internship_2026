import express from 'express';
import { bookAppointment, getMyAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);

export default router;