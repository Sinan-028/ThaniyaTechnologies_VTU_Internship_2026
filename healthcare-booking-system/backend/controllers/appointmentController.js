import Appointment from '../models/appointmentModel.js';

// BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent past booking
    if (new Date(appointmentDate) < new Date()) {
      return res.status(400).json({
        message: "Cannot book appointment in the past"
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate
    });

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATIENT APPOINTMENTS
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ patient: req.user.id })
      .populate('doctor', 'name specialization');

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DOCTOR APPOINTMENTS
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ doctor: req.user.id })
      .populate('patient', 'name email');

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment cancelled" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};