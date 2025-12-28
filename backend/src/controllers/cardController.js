import { CardModel } from "../models/cardModel.js";
import { SubscriptionModel } from "../models/subscribtionModel.js";
import { validateCardFeatures } from "../utils/cardFeatureGaurd.js";

/**
 * Create Digital Card
 */
export const createCard = async (req, res) => {
  const uid = req.user.uid;
  const subscription = await SubscriptionModel.findByUid(uid);

  const error = validateCardFeatures(subscription, req.body);
  if (error) return res.status(403).json({ message: error });

  const card = await CardModel.create(uid, req.body);
  await SubscriptionModel.incrementCardCount(uid);

  res.status(201).json(card);
};

/**
 * Fetch my cards
 */
export const getMyCards = async (req, res) => {
  const cards = await CardModel.findByOwner(req.user.uid);
  res.json(cards);
};

/**
 * Update card
 */
export const updateCard = async (req, res) => {
  const success = await CardModel.update(
    req.params.cardId,
    req.user.uid,
    req.body
  );

  if (!success) return res.status(404).json({ message: "Card not found" });

  res.json({ updated: true });
};

/**
 * Delete card
 */
export const deleteCard = async (req, res) => {
  const success = await CardModel.delete(req.params.cardId, req.user.uid);

  if (!success) return res.status(404).json({ message: "Card not found" });

  res.json({ deleted: true });
};

/**
 * Public card fetch
 */
export const getCardByLink = async (req, res) => {
  const cardLink = req.params[0]; // regex capture group

  const card = await CardModel.findByLink(cardLink);

  if (!card) {
    return res.status(404).json({ message: "Card not found" });
  }

  res.json(card);
};
