const express = require("express");
const router = express.Router();
const subController = require("../controllers/subscription.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

// Upgrade Plan (e.g., Free -> Pro)
router.post("/upgrade", subController.changePlan);

// Get Plan Details & Usage (e.g., "1 of 10 cards used")
router.get("/details", subController.getPlanDetails);

module.exports = router;
