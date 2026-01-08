// controllers/subscription.controller.js
const SubscriptionService = require("../services/subscription.service");
const admin = require("firebase-admin");

exports.changePlan = async (req, res) => {
  const { planId, billingCycle } = req.body; // Expects 'Pro', 'Creator' and 'monthly'/'yearly'

  if (!planId) return res.status(400).json({ error: "Plan ID is required" });

  try {
    const subscription = await SubscriptionService.upgradePlan(
      req.user.uid,
      planId,
      billingCycle || "monthly"
    );

    res.status(200).json({
      message: `Successfully upgraded to ${planId}`,
      subscription,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlanDetails = async (req, res) => {
  try {
    // 1. Get User's Current Plan ID
    const userDoc = await admin
      .firestore()
      .collection("USER")
      .doc(req.user.uid)
      .get();

    if (!userDoc.exists)
      return res.status(404).json({ error: "User not found" });

    const currentPlanId = userDoc.data().subscriptionPlan;

    // 2. Get Configuration for that Plan
    const planConfig = await admin
      .firestore()
      .collection("PLAN_CONFIG")
      .doc(currentPlanId)
      .get();

    if (!planConfig.exists)
      return res.status(404).json({ error: "Plan config missing" });

    // 3. Get User's Current Usage to show progress (e.g., "1 of 10 cards used")
    const usageDoc = await admin
      .firestore()
      .collection("USAGE")
      .doc(req.user.uid)
      .get();
    const usage = usageDoc.exists ? usageDoc.data() : { cardsCreated: 0 };

    res.status(200).json({
      plan: planConfig.data(),
      usage: usage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
