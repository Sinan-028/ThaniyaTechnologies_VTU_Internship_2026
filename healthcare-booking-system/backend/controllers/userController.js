import User from "../models/userModel.js";

export const toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.isAvailable = !user.isAvailable;
    await user.save();

    res.json({ isAvailable: user.isAvailable });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};