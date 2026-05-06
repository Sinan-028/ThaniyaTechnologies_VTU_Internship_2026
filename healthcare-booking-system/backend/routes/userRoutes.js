import express from "express";
import { toggleAvailability } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.patch("/availability", protect, toggleAvailability);

export default router;