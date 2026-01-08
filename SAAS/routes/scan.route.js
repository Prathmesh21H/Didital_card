const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scan.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Middleware helper: Try to verify token, but don't fail if missing
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    return verifyToken(req, res, next);
  }
  next();
};

// Track Scan (Open to public, captures User ID if logged in)
router.post("/track/:cardId", optionalAuth, scanController.trackScan);

// Save Card to Wallet (Strictly Protected)
router.post("/save", verifyToken, scanController.saveCard);

// View Saved Wallet
router.get("/saved", verifyToken, scanController.getMySavedCards);

// Remove from Wallet (Unsave)
router.delete("/saved/:cardId", verifyToken, scanController.unsaveCard);

module.exports = router;
