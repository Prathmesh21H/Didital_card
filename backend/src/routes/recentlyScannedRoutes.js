import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  saveScannedCard,
  getRecentlyScannedCards,
} from "../controllers/recentlyScannedController.js";

const router = express.Router();

// 1. ADD 'requireAuth' HERE so req.user is populated
router.post("/", requireAuth, saveScannedCard);

// Get my scanned cards
router.get("/me", requireAuth, getRecentlyScannedCards);

export default router;
