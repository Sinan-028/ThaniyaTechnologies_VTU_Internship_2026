import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("name email role");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};