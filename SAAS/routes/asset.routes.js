const express = require("express");
const router = express.Router();
const assetController = require("../controllers/asset.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Public Marketplace: View items (e.g., ?type=skin&access=Free)
router.get("/marketplace", assetController.getAssets);

// Protected Routes
router.use(verifyToken);

// Creator: Upload new asset (Skin, Layout, Animation)
router.post("/upload", assetController.uploadAsset);

// Creator: View own uploads
router.get("/my-uploads", assetController.getMyUploads);

// Admin: Approve asset
router.patch("/approve/:id", assetController.approveAsset);

module.exports = router;
