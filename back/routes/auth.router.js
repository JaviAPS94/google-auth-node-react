import express from "express";
import { handleGoogleAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// Route to handle Google authentication
router.post("/google", handleGoogleAuth);

export default router;
