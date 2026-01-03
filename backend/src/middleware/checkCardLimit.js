import { SubscriptionModel } from "../models/subscribtionModel.js";

const checkCardLimit = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    let sub = await SubscriptionModel.findByUid(uid);

    if (!sub) {
      console.log(`No subscription found for ${uid}, creating FREE plan...`); // Debug Log
      sub = await SubscriptionModel.createFree(uid);
    }

    // --- DEBUG LOGGING ---
    console.log("Subscription Check:", {
      uid: sub.uid,
      plan: sub.plan,
      created: sub.cardsCreated,
      max: sub.maxCards,
    });
    // ---------------------

    const isActive = true;

    if (!isActive) {
      return res.status(403).json({ message: "Subscription inactive." });
    }

    // Check limit
    if (sub.maxCards !== "unlimited" && sub.cardsCreated >= sub.maxCards) {
      console.log("403 Forbidden: Limit reached"); // Debug Log
      return res.status(403).json({
        message: `Card limit reached (${sub.cardsCreated}/${sub.maxCards}). Upgrade to create more.`,
      });
    }

    next();
  } catch (error) {
    console.error("Check Card Limit Error:", error);
    res.status(500).json({ message: "Server error validating subscription." });
  }
};

export default checkCardLimit;
