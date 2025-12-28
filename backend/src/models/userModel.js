import admin from "../config/firebaseAdmin.js";

const db = admin.firestore();
const COLLECTION = "users";

export const UserModel = {
  /**
   * Create new user
   * docId = uid
   */
  async create(uid, user) {
    const ref = db.collection(COLLECTION).doc(uid);

    await ref.set({
      uid,
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid, ...user };
  },

  /**
   * Find user by uid
   */
  async findByUid(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();

    if (!doc.exists) return null;

    return { uid: doc.id, ...doc.data() };
  },

  /**
   * Update user by uid
   */
  async update(uid, data) {
    const ref = db.collection(COLLECTION).doc(uid);
    const doc = await ref.get();

    if (!doc.exists) return null;

    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedDoc = await ref.get();
    return { uid, ...updatedDoc.data() };
  },
};
