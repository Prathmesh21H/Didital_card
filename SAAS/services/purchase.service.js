// services/purchase.service.js
const admin = require("firebase-admin");
const AssetService = require("./asset.service"); // To fetch asset details

class PurchaseService {
  /**
   * Execute a Purchase
   * @param {string} buyerId - The user buying the asset
   * @param {string} assetId - The asset being bought
   */
  async purchaseAsset(buyerId, assetId) {
    const db = admin.firestore();

    // 1. Fetch Asset Details
    const asset = await AssetService.getAssetById(assetId);
    if (!asset) throw new Error("Asset not found");
    if (!asset.isApproved) throw new Error("Asset is not available for sale");
    if (asset.access === "Free")
      throw new Error("This asset is free, no purchase needed.");
    if (asset.creatorId === buyerId)
      throw new Error("You cannot buy your own asset.");

    // 2. Define Financials
    const price = asset.price;
    const platformFeePercentage = 0.1; // Example: 10% platform fee
    const platformFee = price * platformFeePercentage;
    const creatorEarnings = price - platformFee;

    // 3. Atomic Transaction
    const batch = db.batch();
    const purchaseRef = db.collection("PURCHASE").doc();
    const buyerRef = db.collection("USER").doc(buyerId);
    const creatorRef = db.collection("USER").doc(asset.creatorId);

    // A. Create Purchase Record
    const newPurchase = {
      purchaseId: purchaseRef.id,
      assetId: assetId,
      buyerId: buyerId,
      creatorId: asset.creatorId,
      price: price,
      platformFee: platformFee,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    batch.set(purchaseRef, newPurchase);

    // B. Add to Buyer's "Owned Assets" Library (Optional sub-collection)
    // This makes it easy to query "What do I own?" later
    const libraryRef = buyerRef.collection("LIBRARY").doc(assetId);
    batch.set(libraryRef, {
      assetId: assetId,
      type: asset.type,
      purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // C. (Optional) Update Creator's Wallet/Balance if you track it internally
    // batch.update(creatorRef, { walletBalance: admin.firestore.FieldValue.increment(creatorEarnings) });

    await batch.commit();
    return newPurchase;
  }

  /**
   * Get User's Purchase History
   */
  async getPurchaseHistory(uid) {
    const snapshot = await admin
      .firestore()
      .collection("PURCHASE")
      .where("buyerId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Check if User owns an asset
   */
  async checkOwnership(uid, assetId) {
    const doc = await admin
      .firestore()
      .collection("USER")
      .doc(uid)
      .collection("LIBRARY")
      .doc(assetId)
      .get();
    return doc.exists;
  }
}

module.exports = new PurchaseService();
