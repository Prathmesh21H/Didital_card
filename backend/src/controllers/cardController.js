import { CardModel } from "../models/cardModel.js";
import { SubscriptionModel } from "../models/subscriptionModel.js"; // Ensure typo matches your file 'subscribtionModel.js'
import { validateCardFeatures } from "../utils/cardFeatureGaurd.js";

// --- HELPER: Remove undefined values ---
const cleanData = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Create Digital Card
 */
export const createCard = async (req, res) => {
  try {
    const uid = req.user.uid;

    // 1. Get Subscription (Middleware has already checked the limit, but we need settings for validation)
    const subscription = await SubscriptionModel.findByUid(uid);

    if (!subscription) {
      return res.status(403).json({
        message: "No active subscription found for this user",
      });
    }

    const cardData = cleanData(req.body);

    // 2. Validate Feature usage (e.g. is this theme allowed on this plan?)
    const error = validateCardFeatures(subscription, cardData);
    if (error) return res.status(403).json({ message: error });

    // 3. Create Card
    const card = await CardModel.create(uid, cardData);

    // 4. Increment Count
    await SubscriptionModel.incrementCardCount(uid);

    res.status(201).json(card);
  } catch (err) {
    console.error("Create Card Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Fetch my cards
 */
export const getMyCards = async (req, res) => {
  try {
    const cards = await CardModel.findByOwner(req.user.uid);
    res.json({ cards }); // ✅ wrap in object
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * Fetch single card by ID (For Edit Page)
 */
export const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const uid = req.user.uid;

    const card = await CardModel.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Ownership check
    if (card.ownerUid !== uid) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(card);
  } catch (err) {
    console.error("Get card error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update card
 */
export const updateCard = async (req, res) => {
  try {
    const updateData = cleanData(req.body);

    const success = await CardModel.update(
      req.params.cardId,
      req.user.uid,
      updateData
    );

    if (!success) return res.status(404).json({ message: "Card not found" });

    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete card
 * UPDATE: Now decrements the card count
 */
export const deleteCard = async (req, res) => {
  try {
    const uid = req.user.uid;
    const cardId = req.params.cardId;

    // 1. Attempt Delete
    const success = await CardModel.delete(cardId, uid);

    if (!success) {
      return res.status(404).json({ message: "Card not found" });
    }

    // 2. Decrement Count on success
    // This fixes the "Limit Reached" error after deleting items
    await SubscriptionModel.decrementCardCount(uid);

    res.json({ deleted: true });
  } catch (err) {
    console.error("Delete Card Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Public card fetch
 */
export const getCardByLink = async (req, res) => {
  try {
    // With regex routes, the capture group is at index 0
    const cardLink = req.params[0];

    if (!cardLink) {
      return res.status(404).json({ message: "No link provided" });
    }

    const card = await CardModel.findByLink(cardLink);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ card });
  } catch (err) {
    console.error("Public Fetch Error:", err);
    res.status(500).json({ message: err.message });
  }
};
