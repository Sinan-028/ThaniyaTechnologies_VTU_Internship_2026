import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from '../controllers/appointmentController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Book appointment
router.post('/book', protect, bookAppointment);

// Get patient appointments
router.get('/my-appointments', protect, getMyAppointments);

// Get doctor appointments
router.get('/doctor-appointments', protect, getDoctorAppointments);

// Update status
router.patch('/:id/status', protect, updateAppointmentStatus);

// Delete appointment
router.delete('/:id', protect, deleteAppointment);

export default router;