import { SubscriptionModel } from "../models/subscriptionModel.js";

const checkCardLimit = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // 1️⃣ Fetch subscription
    let sub = await SubscriptionModel.findByUid(uid);

    // 2️⃣ Auto-create FREE plan if missing
    if (!sub) {
      console.log(`No subscription found for ${uid}, creating FREE plan...`);
      sub = await SubscriptionModel.createFree(uid);
    }

    const {
      plan,
      cardsCreated = 0,
      cardLimit = 0,
      isUnlimited = false,
    } = sub;

    // 3️⃣ DEBUG LOG (KEEP THIS)
    console.log("Subscription Check:", {
      uid,
      plan,
      cardsCreated,
      cardLimit,
      isUnlimited,
    });

    // 4️⃣ Enforce limit ONLY if not unlimited
    if (!isUnlimited && cardsCreated >= cardLimit) {
      console.log("403 Forbidden: Card limit reached");

      return res.status(403).json({
        message: `Card limit reached (${cardsCreated}/${cardLimit}). Upgrade to create more.`,
      });
    }

    // 5️⃣ Allow request
    next();
  } catch (error) {
    console.error("Check Card Limit Error:", error);
    res.status(500).json({
      message: "Server error validating subscription.",
    });
  }
};

export default checkCardLimit;
