// controllers/card.controller.js
const CardService = require("../services/card.service");

exports.createCard = async (req, res) => {
  try {
    const card = await CardService.createCard(req.user.uid, req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyCards = async (req, res) => {
  try {
    const cards = await CardService.getUserCards(req.user.uid);
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCard = async (req, res) => {
  try {
    const card = await CardService.getCardById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const updated = await CardService.updateCard(
      req.params.id,
      req.user.uid,
      req.body
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    await CardService.deleteCard(req.params.id, req.user.uid);
    res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
