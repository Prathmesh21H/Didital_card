import { SubscriptionModel } from "../models/subscribtionModel.js";

const PLAN_CONFIG = {
  FREE: { cardLimit: 1 },
  PRO: { cardLimit: "unlimited" },
  PREMIUM: { cardLimit: "unlimited" },
};

export const selectPlan = async (req, res) => {
  const { plan } = req.body;
  const uid = req.user.uid;

  if (!PLAN_CONFIG[plan]) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  const existing = await SubscriptionModel.findByUid(uid);
  if (existing) {
    return res.status(409).json({ message: "Plan already selected" });
  }

  if (plan === "FREE") {
    await SubscriptionModel.create(uid, {
      plan,
      cardLimit: 1,
      cardsCreated: 0,
      status: "active",
    });

    return res.status(201).json({ requiresPayment: false });
  }

  res.json({ requiresPayment: true, plan });
};

export const confirmPayment = async (req, res) => {
  const { plan, paymentGateway = "demo", paymentId = "demo_txn" } = req.body;
  const uid = req.user.uid;

  await SubscriptionModel.update(uid, {
    plan,
    cardLimit: PLAN_CONFIG[plan].cardLimit,
    status: "active",
    paymentGateway,
    paymentId,
  });

  res.json({ paymentConfirmed: true, demoMode: true });
};

export const downgradeToFree = async (req, res) => {
  const uid = req.user.uid;

  await SubscriptionModel.update(uid, {
    plan: "FREE",
    cardLimit: 1,
    status: "active",
    paymentGateway: null,
    paymentId: null,
  });

  res.json({ downgraded: true });
};

export const getSubscription = async (req, res) => {
  const uid = req.user.uid;
  const subscription = await SubscriptionModel.findByUid(uid);

  if (!subscription) {
    return res.status(404).json({ message: "No subscription found" });
  }

  res.json(subscription);
};
