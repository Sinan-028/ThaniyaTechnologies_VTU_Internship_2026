import Appointment from '../models/appointmentModel.js';

// book appnmnt wth dte vldtn
export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body;
        
        // Prevent booking in the past
        if (new Date(appointmentDate) < new Date()) {
            return res.status(400).json({ message: "You cannot book an appointment in the past." });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const newAppointment = await Appointment.create({
            patient: req.user.id, 
            doctor: doctorId,
            appointmentDate
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ptnt appntmtns
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name specialization');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// dctr appntmnts
export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name email'); 
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4.ststs updt
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. cncl appntmnt
export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};