// services/card.service.js
const admin = require("firebase-admin");
const SubscriptionService = require("./subscription.service");

class CardService {
  // 1. Create Card
  async createCard(uid, cardData) {
    const db = admin.firestore();

    // A. Verify Entitlements (Limit Check)
    const canCreate = await SubscriptionService.verifyEntitlement(
      uid,
      "CREATE_CARD"
    );
    if (!canCreate) {
      throw new Error(
        "Plan limit reached. Please upgrade to create more cards."
      );
    }

    // B. Verify Feature Entitlements (e.g., Custom Slug, Animation)
    if (cardData.hasCustomSlug) {
      const canSlug = await SubscriptionService.verifyEntitlement(
        uid,
        "CUSTOM_SLUG"
      );
      if (!canSlug) throw new Error("Your plan does not support custom slugs.");
    }

    if (cardData.animationId) {
      const canAnimate = await SubscriptionService.verifyEntitlement(
        uid,
        "ANIMATION"
      );
      if (!canAnimate)
        throw new Error("Your plan does not support animations.");
    }

    // C. Atomic Write (Card + Usage Increment)
    const batch = db.batch();
    const cardRef = db.collection("CARD").doc();
    const usageRef = db.collection("USAGE").doc(uid);

    const newCard = {
      cardId: cardRef.id,
      userId: uid,
      publicSlug: cardData.publicSlug || cardRef.id,
      hasCustomSlug: cardData.hasCustomSlug || false,
      layoutId: cardData.layoutId || null,
      skinId: cardData.skinId || null,
      bannerId: cardData.bannerId || null,
      animationId: cardData.animationId || null,
      canvasData: cardData.canvasData || {}, // JSON data for Canva-like editor
      visibility: cardData.visibility || "public",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(cardRef, newCard);

    // Increment the 'cardsCreated' counter in USAGE
    // We use merge: true in case USAGE doc is missing (self-healing)
    batch.set(
      usageRef,
      {
        cardsCreated: admin.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );

    await batch.commit();
    return newCard;
  }

  // 2. Get All Cards for a User
  async getUserCards(uid) {
    const snapshot = await admin
      .firestore()
      .collection("CARD")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  // 3. Get Card By ID
  async getCardById(cardId) {
    const doc = await admin.firestore().collection("CARD").doc(cardId).get();
    return doc.exists ? doc.data() : null;
  }

  // 4. Update Card
  async updateCard(cardId, uid, updateData) {
    const cardRef = admin.firestore().collection("CARD").doc(cardId);
    const card = await cardRef.get();

    if (!card.exists || card.data().userId !== uid) {
      throw new Error("Unauthorized or Card not found");
    }

    // Filter updateData to prevent overwriting critical fields (like userId)
    const safeUpdate = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    delete safeUpdate.userId;
    delete safeUpdate.createdAt;
    delete safeUpdate.cardId;

    await cardRef.update(safeUpdate);

    return (await cardRef.get()).data();
  }

  // 5. Delete Card
  async deleteCard(cardId, uid) {
    const db = admin.firestore();
    const cardRef = db.collection("CARD").doc(cardId);
    const usageRef = db.collection("USAGE").doc(uid);

    await db.runTransaction(async (t) => {
      const doc = await t.get(cardRef);
      if (!doc.exists || doc.data().userId !== uid) {
        throw new Error("Unauthorized or Card not found");
      }

      t.delete(cardRef);
      // Decrement Usage
      t.update(usageRef, {
        cardsCreated: admin.firestore.FieldValue.increment(-1),
      });
    });

    return { success: true };
  }
}

module.exports = new CardService();
