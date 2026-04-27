import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    specialization: { type: String }, // Only mndtry if role is dctr
    isAvailable: { type: Boolean, default: true } // For dctrs
}, { timestamps: true });

export default mongoose.model('User', userSchema);