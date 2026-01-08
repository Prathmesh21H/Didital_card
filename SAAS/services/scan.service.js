// services/scan.service.js
const admin = require("firebase-admin");

class ScanService {
  /**
   * Record a Scan Event
   */
  async recordScan(cardId, scannerUid = null) {
    // ... (Same as previous) ...
    const db = admin.firestore();
    const batch = db.batch();
    const scanRef = db.collection("SCAN").doc();
    const scanData = {
      scanId: scanRef.id,
      cardId: cardId,
      scannedBy: scannerUid || "anonymous",
      isSaved: false,
      scannedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    batch.set(scanRef, scanData);

    // Increment owner usage
    const cardDoc = await db.collection("CARD").doc(cardId).get();
    if (cardDoc.exists) {
      const usageRef = db.collection("USAGE").doc(cardDoc.data().userId);
      batch.set(
        usageRef,
        {
          scansCount: admin.firestore.FieldValue.increment(1),
        },
        { merge: true }
      );
    }

    await batch.commit();
    return { scanId: scanRef.id, ...scanData };
  }

  /**
   * Save a Card
   */
  async saveCard(uid, cardId) {
    const db = admin.firestore();
    const cardDoc = await db.collection("CARD").doc(cardId).get();
    if (!cardDoc.exists) throw new Error("Card does not exist");

    const savedRef = db
      .collection("USER")
      .doc(uid)
      .collection("SAVED_CARDS")
      .doc(cardId);

    await savedRef.set({
      cardId: cardId,
      cardOwnerId: cardDoc.data().userId,
      savedAt: admin.firestore.FieldValue.serverTimestamp(),
      previewSlug: cardDoc.data().publicSlug || "",
    });

    // Optional: Mark recent scan as saved
    const recentScan = await db
      .collection("SCAN")
      .where("cardId", "==", cardId)
      .where("scannedBy", "==", uid)
      .orderBy("scannedAt", "desc")
      .limit(1)
      .get();

    if (!recentScan.empty) {
      await recentScan.docs[0].ref.update({ isSaved: true });
    }

    return { success: true };
  }

  /**
   * Get Saved Cards
   */
  async getSavedCards(uid) {
    const snapshot = await admin
      .firestore()
      .collection("USER")
      .doc(uid)
      .collection("SAVED_CARDS")
      .orderBy("savedAt", "desc")
      .get();
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * DELETE (Unsave) a Card from Collection
   */
  async deleteSavedCard(uid, cardId) {
    const db = admin.firestore();
    const docRef = db
      .collection("USER")
      .doc(uid)
      .collection("SAVED_CARDS")
      .doc(cardId);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error("Card not found in your collection");
    }

    // Delete the document
    await docRef.delete();

    // Optional: Sync back to the SCAN logs (Update 'isSaved' to false)
    // This maintains analytics accuracy ("User unsaved the card")
    const recentScan = await db
      .collection("SCAN")
      .where("cardId", "==", cardId)
      .where("scannedBy", "==", uid)
      .orderBy("scannedAt", "desc")
      .limit(1)
      .get();

    if (!recentScan.empty) {
      await recentScan.docs[0].ref.update({ isSaved: false });
    }

    return { success: true };
  }
}

module.exports = new ScanService();
