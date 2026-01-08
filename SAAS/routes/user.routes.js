const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// All routes require login
router.use(verifyToken);

// Get current user profile
router.get("/me", userController.getProfile);

// Update profile details
router.patch("/update", userController.updateProfile);

// Complete registration for OAuth users (Google/GitHub)
router.post(
  "/complete-oauth-registration",
  userController.registerOAuthProfile
);

// Delete account
router.delete("/account", userController.deleteUser);

module.exports = router;
