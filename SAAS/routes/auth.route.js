const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateRegistration } = require("../middleware/validator"); // Assumes validator exists

// Step 1: Request OTP for email verification
router.post("/request-otp", authController.requestOTP);

// Step 2: Submit OTP + Profile Data to create account
router.post(
  "/register",
  validateRegistration,
  authController.completeRegistration
);

module.exports = router;
