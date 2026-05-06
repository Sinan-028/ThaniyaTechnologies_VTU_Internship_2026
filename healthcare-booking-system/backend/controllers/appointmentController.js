import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";

//  BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Prevent past booking
    if (new Date(appointmentDate) < new Date()) {
      return res.status(400).json({
        message: "Cannot book appointment in the past"
      });
    }

    //  Check doctor exists
    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    //  Check availability
    if (!doctor.isAvailable) {
      return res.status(400).json({
        message: "Doctor is currently unavailable"
      });
    }

    //  Prevent duplicate booking (same patient + same date)
    const existing = await Appointment.findOne({
      patient: req.user.id,
      appointmentDate
    });

    if (existing) {
      return res.status(400).json({
        message: "You already booked for this date"
      });
    }

    //  Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
      status: "pending"
    });

    res.status(201).json(appointment);

  } catch (error) {
    console.error("BOOK ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};



//  PATIENT APPOINTMENTS
export const getMyAppointments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const appointments = await Appointment
      .find({ patient: req.user.id })
      .populate("doctor", "name specialization");

    res.json(appointments);

  } catch (error) {
    console.error("GET MY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};



//  DOCTOR APPOINTMENTS
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ doctor: req.user.id })
      .populate("patient", "name email");

    res.json(appointments);

  } catch (error) {
    console.error("GET DOCTOR ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};



//  UPDATE STATUS (DOCTOR ONLY)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    //  Only doctor can update
    if (appointment.doctor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);

  } catch (error) {
    console.error("UPDATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};



//  DELETE (PATIENT ONLY)
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    //  Only patient can delete
    if (appointment.patient.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await appointment.deleteOne();

    res.json({ message: "Appointment cancelled" });

  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};