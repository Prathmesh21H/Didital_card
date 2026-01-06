import { SubscriptionModel } from "../models/subscriptionModel.js";

const PLAN_CONFIG = {
  FREE: {
    cardLimit: 1,
    isUnlimited: false,
    features: {
      customTheme: false,
      analytics: false,
      removeBranding: false,
    },
  },
  PRO: {
    cardLimit: 5,
    isUnlimited: false,
    features: {
      customTheme: true,
      analytics: true,
      removeBranding: false,
    },
  },
  PREMIUM: {
    cardLimit: null,
    isUnlimited: true,
    features: {
      customTheme: true,
      analytics: true,
      removeBranding: true,
    },
  },
};

/* ---------------------------------------------------
   SELECT PLAN
--------------------------------------------------- */
export const selectPlan = async (req, res) => {
  let { plan } = req.body;
  const uid = req.user.uid;

  plan = plan?.toUpperCase();

  if (!PLAN_CONFIG[plan]) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  try {
    const existing = await SubscriptionModel.findByUid(uid);

    if (existing && existing.plan === plan) {
      return res.status(409).json({ message: "Plan already active" });
    }

    // FREE → instant activation
    if (plan === "FREE") {
      await SubscriptionModel.createFree(uid);
      return res.status(201).json({ requiresPayment: false });
    }

    // Paid → redirect to payment
    res.json({ requiresPayment: true, plan });
  } catch (err) {
    res.status(500).json({
      message: "Error selecting plan",
      error: err.message,
    });
  }
};

/* ---------------------------------------------------
   CONFIRM PAYMENT (DEMO)
--------------------------------------------------- */
export const confirmPayment = async (req, res) => {
  let { plan, paymentGateway = "demo", paymentId = "demo_txn" } = req.body;
  const uid = req.user.uid;

  plan = plan?.toUpperCase();

  if (!PLAN_CONFIG[plan]) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  try {
    const existing = await SubscriptionModel.findByUid(uid);

    const data = {
      plan,
      cardLimit: PLAN_CONFIG[plan].cardLimit,
      isUnlimited: PLAN_CONFIG[plan].isUnlimited,
      status: "active",
      paymentGateway,
      paymentId,
      features: PLAN_CONFIG[plan].features,
    };

    if (!existing) {
      await SubscriptionModel.create(uid, data);
    } else {
      await SubscriptionModel.update(uid, data);
    }

    res.json({ paymentConfirmed: true, demoMode: true });
  } catch (err) {
    res.status(500).json({
      message: "Payment confirmation failed",
      error: err.message,
    });
  }
};


   
export const getSubscription = async (req, res) => {
  const uid = req.user.uid;

  try {
    let subscription = await SubscriptionModel.findByUid(uid);

    if (!subscription) {
      subscription = await SubscriptionModel.createFree(uid);
    }

    const planConfig = PLAN_CONFIG[subscription.plan] || PLAN_CONFIG.FREE;

    // ✅ NORMALIZED RESPONSE (FRONTEND SAFE)
    res.json({
      id: subscription.uid,                 // ✅ FIX
      plan: subscription.plan,
      created: subscription.cardsCreated,   // ✅ FIX
      max: planConfig.isUnlimited
        ? Infinity
        : planConfig.cardLimit,
      isUnlimited: planConfig.isUnlimited,
      features: planConfig.features,
      status: subscription.status || "active",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching subscription",
      error: err.message,
    });
  }
};


/* ---------------------------------------------------
   DOWNGRADE TO FREE
--------------------------------------------------- */
export const downgradeToFree = async (req, res) => {
  const uid = req.user.uid;

  try {
    await SubscriptionModel.createFree(uid);
    res.json({ downgraded: true });
  } catch (err) {
    res.status(500).json({
      message: "Failed to downgrade",
      error: err.message,
    });
  }
};
