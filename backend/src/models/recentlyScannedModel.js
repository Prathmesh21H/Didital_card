import admin from "../config/firebaseAdmin.js";

const db = admin.firestore();
const COLLECTION = "recentlyScannedCards";

export const RecentlyScannedModel = {
  async get(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    return doc.exists ? doc.data().scannedCards || [] : [];
  },

  async add(uid, cardLink, maxLimit) {
    const ref = db.collection(COLLECTION).doc(uid);
    const doc = await ref.get();
    let scannedCards = doc.exists ? doc.data().scannedCards || [] : [];

    // Remove oldest if limit reached
    if (maxLimit !== "unlimited" && scannedCards.length >= maxLimit) {
      scannedCards.shift();
    }

    scannedCards.push({
      cardLink,
      scannedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await ref.set({ scannedCards }, { merge: true });
    return scannedCards;
  },
};
