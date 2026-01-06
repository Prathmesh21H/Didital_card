import { SubscriptionModel } from "../models/subscriptionModel.js";

const checkCardLimit = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    let sub = await SubscriptionModel.findByUid(uid);

    // Auto-create FREE plan
    if (!sub) {
      sub = await SubscriptionModel.createFree(uid);
    }

    // 🔥 AUTO FIX OLD DATA
    if (sub.plan === "FREE" && sub.cardLimit !== 1) {
      await SubscriptionModel.update(uid, { cardLimit: 1 });
      sub.cardLimit = 1;
    }
    if (sub.plan === "PRO" && sub.cardLimit !== 5) {
      await SubscriptionModel.update(uid, {
        cardLimit: 5,
        isUnlimited: false,
      });
      sub.cardLimit = 5;
      sub.isUnlimited = false;
    }
    

    const { cardsCreated = 0, cardLimit, isUnlimited } = sub;

    console.log("Subscription Check:", {
      uid,
      plan: sub.plan,
      cardsCreated,
      cardLimit,
      isUnlimited,
    });

    if (!isUnlimited && cardsCreated >= cardLimit) {
      return res.status(403).json({
        message: `Card limit reached (${cardsCreated}/${cardLimit})`,
      });
    }

    next();
  } catch (err) {
    console.error("Check Card Limit Error:", err);
    res.status(500).json({ message: "Subscription validation failed" });
  }
};

export default checkCardLimit;
