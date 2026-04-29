import Appointment from '../models/appointmentModel.js';

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate } = req.body;
        
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

export const getMyAppointments = async (req, res) => {
    try {
        // Fetch appointments where the patient matches the logged-in user
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name specialization'); // Populates doctor details
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//fr dctrs dshbrd
export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name email'); 
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//dctr or ptnt can chnge stts 
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};