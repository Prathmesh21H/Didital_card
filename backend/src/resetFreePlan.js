// resetPlans.js
import admin from "./config/firebaseAdmin.js"; // adjust path if needed

const db = admin.firestore();
const COLLECTION = "subscriptions";

const PLAN_RESET = {
  FREE: {
    cardLimit: 1,
    cardsCreated: 0,
    isUnlimited: false,
    status: "active",
  },
  PRO: {
    cardLimit: 5,
    cardsCreated: 0,
    isUnlimited: false,
    status: "active",
  },
  // PREMIUM stays unlimited, you can add if needed
};

async function resetPlans() {
  try {
    const snapshot = await db.collection(COLLECTION).get();

    if (snapshot.empty) {
      console.log("No subscriptions found.");
      return;
    }

    let count = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const plan = data.plan?.toUpperCase();

      if (PLAN_RESET[plan]) {
        await db.collection(COLLECTION).doc(doc.id).update({
          ...PLAN_RESET[plan],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Reset ${plan} plan for UID: ${doc.id}`);
        count++;
      }
    }

    console.log(`✅ Reset ${count} subscription(s) successfully.`);
  } catch (err) {
    console.error("Error resetting subscriptions:", err);
  }
}

resetPlans();
