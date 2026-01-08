// controllers/asset.controller.js
const AssetService = require("../services/asset.service");

// 1. Upload Asset
exports.uploadAsset = async (req, res) => {
  try {
    const { type, name, price, fileUrl, access } = req.body;

    // Basic Validation
    if (!type || !name || !fileUrl) {
      return res
        .status(400)
        .json({ error: "Missing required fields (type, name, fileUrl)" });
    }

    const asset = await AssetService.createAsset(req.user.uid, req.body);

    res.status(201).json({
      message: asset.isApproved
        ? "Asset created"
        : "Asset submitted for approval",
      asset,
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

// 2. Get Public Assets (Marketplace)
exports.getAssets = async (req, res) => {
  try {
    const { type, access } = req.query; // ?type=skin&access=Free
    const assets = await AssetService.getMarketplaceAssets(type, access);
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get My Uploads (For Creator Dashboard)
exports.getMyUploads = async (req, res) => {
  try {
    const assets = await AssetService.getMyAssets(req.user.uid);
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Approve Asset (Admin Only)
exports.approveAsset = async (req, res) => {
  try {
    // Check if user is actually admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    await AssetService.approveAsset(req.params.id);
    res.status(200).json({ message: "Asset approved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
