import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  saveScannedCard,
  getRecentlyScannedCards,
} from "../controllers/recentlyScannedController.js";

const router = express.Router();

// Save scanned card
router.post("/", saveScannedCard);

// Get my scanned cards (registered)
router.get("/me", requireAuth, getRecentlyScannedCards);

export default router;
