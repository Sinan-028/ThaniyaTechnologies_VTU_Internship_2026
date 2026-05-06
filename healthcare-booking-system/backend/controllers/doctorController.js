import User from "../models/userModel.js";

export const getDoctors = async (req, res) => {
  const doctors = await User.find({ role: "doctor" })
    .select("name specialization isAvailable");

  res.json(doctors);
};
export const addDoctor = async (req, res) => {
  res.json({ message: "Not used anymore" });
};