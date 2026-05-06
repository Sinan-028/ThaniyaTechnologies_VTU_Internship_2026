import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // 🔍 DEBUG (optional)
    console.log("AUTH HEADER:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // 🔐 VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("DECODED:", decoded);

      // ✅ FETCH USER FROM DB (BEST PRACTICE)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // ✅ ENSURE req.user HAS id
      req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
      };

      next();

    } else {
      return res.status(401).json({ message: "No token provided" });
    }

  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};