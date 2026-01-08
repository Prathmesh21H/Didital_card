// controllers/scan.controller.js
const ScanService = require("../services/scan.service");

// ... (trackScan and saveCard methods remain the same) ...

exports.trackScan = async (req, res) => {
  // ... existing logic
  try {
    const { cardId } = req.params;
    const scannerUid = req.user ? req.user.uid : null;
    const result = await ScanService.recordScan(cardId, scannerUid);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveCard = async (req, res) => {
  // ... existing logic
  try {
    const { cardId } = req.body;
    if (!cardId) return res.status(400).json({ error: "Card ID is required" });
    await ScanService.saveCard(req.user.uid, cardId);
    res.status(200).json({ message: "Card saved to your collection" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMySavedCards = async (req, res) => {
  // ... existing logic
  try {
    const cards = await ScanService.getSavedCards(req.user.uid);
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: Delete Saved Card
exports.unsaveCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      return res.status(400).json({ error: "Card ID is required" });
    }

    await ScanService.deleteSavedCard(req.user.uid, cardId);
    res.status(200).json({ message: "Card removed from collection" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
