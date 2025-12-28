import { SubscriptionModel } from "../models/subscribtionModel.js";

const checkCardLimit = async (req, res, next) => {
  const uid = req.user.uid;
  const sub = await SubscriptionModel.findByUid(uid);

  if (!sub || sub.status !== "active") {
    return res.status(403).json({ message: "No active subscription" });
  }

  if (sub.cardLimit !== "unlimited" && sub.cardsCreated >= sub.cardLimit) {
    return res.status(403).json({ message: "Card limit reached" });
  }

  next();
};

export default checkCardLimit;
