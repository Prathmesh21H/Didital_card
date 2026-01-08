// services/enterprise.service.js
const admin = require("firebase-admin");

class EnterpriseService {
  /**
   * Register a new Enterprise (Admin Only)
   */
  async createEnterprise(adminUid, data) {
    const db = admin.firestore();
    const entRef = db.collection("ENTERPRISE").doc();

    const newEnterprise = {
      enterpriseId: entRef.id,
      name: data.name,
      domainVerified: data.domainVerified, // e.g., "google.com"
      adminUserId: adminUid,
      pricePerUser: parseFloat(data.pricePerUser) || 5.0,
      pricePerRoom: parseFloat(data.pricePerRoom) || 10.0,
      currentOwedBalance: 0.0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await entRef.set(newEnterprise);

    // Auto-update the Admin user to have this enterpriseId
    await db.collection("USER").doc(adminUid).update({
      enterpriseId: entRef.id,
      role: "EnterpriseAdmin",
      subscriptionPlan: "Enterprise",
    });

    return newEnterprise;
  }

  /**
   * Log a Billable Event (Internal Use)
   * e.g., 'USER_ADDED' ($5) or 'ROOM_CREATED' ($10)
   */
  async logBillableEvent(enterpriseId, eventType) {
    const db = admin.firestore();

    // 1. Get Enterprise Pricing
    const entDoc = await db.collection("ENTERPRISE").doc(enterpriseId).get();
    if (!entDoc.exists) throw new Error("Enterprise not found");
    const entData = entDoc.data();

    let cost = 0;
    if (eventType === "USER_ADDED") cost = entData.pricePerUser;
    if (eventType === "ROOM_CREATED") cost = entData.pricePerRoom;

    const batch = db.batch();

    // 2. Create Log Entry
    const logRef = db.collection("ENTERPRISE_BILLING_LOG").doc();
    batch.set(logRef, {
      logId: logRef.id,
      enterpriseId: enterpriseId,
      eventType: eventType,
      amount: cost,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 3. Update Balance
    const entRef = db.collection("ENTERPRISE").doc(enterpriseId);
    batch.update(entRef, {
      currentOwedBalance: admin.firestore.FieldValue.increment(cost),
    });

    await batch.commit();
    return cost;
  }

  /**
   * Get Billing Overview for Dashboard
   */
  async getBillingOverview(enterpriseId) {
    const db = admin.firestore();
    const entDoc = await db.collection("ENTERPRISE").doc(enterpriseId).get();

    // Get Logs (Last 30 days usually, but fetching all for now)
    const logsSnapshot = await db
      .collection("ENTERPRISE_BILLING_LOG")
      .where("enterpriseId", "==", enterpriseId)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    return {
      enterprise: entDoc.data(),
      recentLogs: logsSnapshot.docs.map((doc) => doc.data()),
    };
  }
}

module.exports = new EnterpriseService();
