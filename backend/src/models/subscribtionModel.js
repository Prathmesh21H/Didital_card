import admin from "../config/firebaseAdmin.js";

const db = admin.firestore();
const COLLECTION = "subscriptions";

export const SubscriptionModel = {
  async findByUid(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    return doc.exists ? { uid: doc.id, ...doc.data() } : null;
  },

  async create(uid, data) {
    await db
      .collection(COLLECTION)
      .doc(uid)
      .set({
        uid,
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  },

  async update(uid, data) {
    await db
      .collection(COLLECTION)
      .doc(uid)
      .update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  },

  async incrementCardCount(uid) {
    await db
      .collection(COLLECTION)
      .doc(uid)
      .update({
        cardsCreated: admin.firestore.FieldValue.increment(1),
      });
  },
};
