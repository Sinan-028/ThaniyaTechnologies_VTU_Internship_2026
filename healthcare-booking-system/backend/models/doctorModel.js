import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "Mangalore",
  },
  availableSlots: [
    {
      date: String,
      times: [String],
    },
  ],
});

export default mongoose.model("Doctor", doctorSchema);