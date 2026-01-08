const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchase.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

// Buy an Asset
// Body: { "assetId": "..." }
router.post("/buy", purchaseController.buyAsset);

// View Purchase History
router.get("/history", purchaseController.getMyPurchases);

module.exports = router;
