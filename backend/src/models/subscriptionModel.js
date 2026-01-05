import admin from "../config/firebaseAdmin.js";

const db = admin.firestore();
const COLLECTION = "subscriptions";

const FREE_PLAN = {
  plan: "FREE",
  cardLimit: 5,
  isUnlimited: false,
  cardsCreated: 0,   // ✅ keep this
  status: "active", // ✅ ADD THIS
  features: {
    customTheme: false,
    analytics: false,
    removeBranding: false,
  },
};


export const SubscriptionModel = {
  async findByUid(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    return doc.exists ? { uid: doc.id, ...doc.data() } : null;
  },

  async createFree(uid) {
    const data = {
      uid,
      ...FREE_PLAN,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection(COLLECTION).doc(uid).set(data);
    return data;
  },

  async create(uid, data) {
    await db.collection(COLLECTION).doc(uid).set({
      uid,
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  },

  async update(uid, data) {
    await db.collection(COLLECTION).doc(uid).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  },

  async incrementCardCount(uid) {
    await db.collection(COLLECTION).doc(uid).update({
      cardsCreated: admin.firestore.FieldValue.increment(1),
    });
  },

  async decrementCardCount(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    const current = doc.data()?.cardsCreated || 0;
    if (current > 0) {
      await db.collection(COLLECTION).doc(uid).update({
        cardsCreated: admin.firestore.FieldValue.increment(-1),
      });
    }
  },
};
