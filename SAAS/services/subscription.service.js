// services/subscription.service.js
const admin = require("firebase-admin");

class SubscriptionService {
  // Helper: Get Plan Configuration
  async getPlanConfig(planId) {
    const doc = await admin
      .firestore()
      .collection("PLAN_CONFIG")
      .doc(planId)
      .get();
    return doc.exists ? doc.data() : null;
  }

  // Helper: Get User Usage
  async getUserUsage(uid) {
    const doc = await admin.firestore().collection("USAGE").doc(uid).get();
    // Return defaults if usage doc doesn't exist yet
    if (!doc.exists) {
      return {
        cardsCreated: 0,
        assetsUsed: 0,
        scansCount: 0,
        aiCreditsUsed: 0,
      };
    }
    return doc.data();
  }

  /**
   * Universal Entitlement Check
   * @param {string} uid
   * @param {string} actionType - 'CREATE_CARD', 'CUSTOM_SLUG', 'ANIMATION', 'MARKETPLACE'
   */
  async verifyEntitlement(uid, actionType) {
    const userDoc = await admin.firestore().collection("USER").doc(uid).get();
    if (!userDoc.exists) throw new Error("User not found");

    const { subscriptionPlan } = userDoc.data();

    const limits = await this.getPlanConfig(subscriptionPlan);
    const usage = await this.getUserUsage(uid);

    if (!limits) throw new Error("Invalid Plan Configuration");

    switch (actionType) {
      case "CREATE_CARD":
        // Enterprise usually has -1 or very high number for unlimited
        if (limits.maxCards === -1) return true;
        return usage.cardsCreated < limits.maxCards;

      case "CUSTOM_SLUG":
        return limits.allowCustomSlug;

      case "ANIMATION":
        return limits.allowAnimations;

      case "MARKETPLACE":
        return limits.allowMarketplace;

      case "AI_GENERATE":
        // Check if they have credits remaining (if strictly metered)
        // Note: Logic could be refined to reset monthly
        return true;

      default:
        return false;
    }
  }

  /**
   * Handle Plan Upgrade/Downgrade
   * Creates a SUBSCRIPTION record and updates USER
   */
  async upgradePlan(uid, planId, billingCycle = "monthly") {
    const db = admin.firestore();
    const batch = db.batch();

    // 1. Calculate Dates
    const startDate = new Date();
    const expiresAt = new Date();
    if (billingCycle === "yearly") {
      expiresAt.setFullYear(startDate.getFullYear() + 1);
    } else {
      expiresAt.setMonth(startDate.getMonth() + 1);
    }

    // 2. Create Subscription Record
    const subRef = db.collection("SUBSCRIPTION").doc();
    const subData = {
      subscriptionId: subRef.id,
      userId: uid,
      planId: planId,
      billingCycle: billingCycle,
      status: "active",
      startedAt: admin.firestore.Timestamp.fromDate(startDate),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    };
    batch.set(subRef, subData);

    // 3. Update User Profile
    const userRef = db.collection("USER").doc(uid);
    batch.update(userRef, { subscriptionPlan: planId });

    // 4. Update Custom Claims (for frontend protection)
    // Note: This is async and might take a few seconds to propagate
    await admin.auth().setCustomUserClaims(uid, { plan: planId });

    await batch.commit();
    return subData;
  }
}

module.exports = new SubscriptionService();
