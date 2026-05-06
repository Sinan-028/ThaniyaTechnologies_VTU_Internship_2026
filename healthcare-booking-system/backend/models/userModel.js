import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient'
    },

    //  Only required if user is a doctor
    specialization: {
      type: String,
      trim: true,
      required: function () {
        return this.role === 'doctor';
      }
    },

    // Doctor availability
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);