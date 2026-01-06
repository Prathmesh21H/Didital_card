import admin from "../config/firebaseAdmin.js";

const db = admin.firestore();
const COLLECTION = "subscriptions";

const FREE_PLAN = {
  plan: "FREE",
  cardLimit: 1,
  isUnlimited: false,
  cardsCreated: 0,
  status: "active",
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

  /* ------------------------------------------------
     🔥 ATOMIC CARD COUNT INCREMENT (ONLY AUTHORITY)
  ------------------------------------------------ */
  async incrementCardCountAtomic(uid) {
    const ref = db.collection(COLLECTION).doc(uid);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new Error("Subscription missing");
      }

      const {
        cardsCreated = 0,
        cardLimit = 1,
        isUnlimited = false,
      } = snap.data();

      if (!isUnlimited && cardsCreated >= cardLimit) {
        throw new Error("CARD_LIMIT_REACHED");
      }

      tx.update(ref, {
        cardsCreated: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
  },

  async decrementCardCount(uid) {
    const ref = db.collection(COLLECTION).doc(uid);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return;

      const current = snap.data().cardsCreated || 0;
      if (current > 0) {
        tx.update(ref, {
          cardsCreated: admin.firestore.FieldValue.increment(-1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });
  },
};
