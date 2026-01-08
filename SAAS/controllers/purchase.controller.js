// controllers/purchase.controller.js
const PurchaseService = require("../services/purchase.service");

exports.buyAsset = async (req, res) => {
  const { assetId } = req.body;

  if (!assetId) {
    return res.status(400).json({ error: "Asset ID is required" });
  }

  try {
    // Note: In a real app, you would verify a Stripe Payment Intent ID here
    const transaction = await PurchaseService.purchaseAsset(
      req.user.uid,
      assetId
    );

    res.status(201).json({
      message: "Purchase successful",
      transaction,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyPurchases = async (req, res) => {
  try {
    const history = await PurchaseService.getPurchaseHistory(req.user.uid);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
