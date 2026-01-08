// services/asset.service.js
const admin = require("firebase-admin");

class AssetService {
  /**
   * Create a new Asset (Creator only)
   */
  async createAsset(uid, assetData) {
    const db = admin.firestore();

    // 1. Check Permissions
    const userDoc = await db.collection("USER").doc(uid).get();
    if (!userDoc.exists) throw new Error("User not found");

    const userRole = userDoc.data().role; // Assumes 'role' exists on User
    // Allow 'Creator' and 'Admin' to upload
    if (!["Creator", "Admin", "EnterpriseUser"].includes(userRole)) {
      throw new Error("Permission Denied: Only Creators can upload assets.");
    }

    // 2. Prepare Asset Data
    const assetRef = db.collection("ASSET").doc();

    // Auto-determine access if not provided
    let accessLevel = assetData.access;
    if (!accessLevel) {
      accessLevel = parseFloat(assetData.price) > 0 ? "Paid" : "Free";
    }

    const newAsset = {
      assetId: assetRef.id,
      type: assetData.type, // 'skin', 'layout', 'animation', 'banner'
      name: assetData.name,
      access: accessLevel, // 'Free', 'Pro', 'Paid'
      creatorId: uid,
      price: parseFloat(assetData.price) || 0,
      isApproved: userRole === "Admin", // Admins auto-approve; Creators wait
      fileUrl: assetData.fileUrl, // URL from Firebase Storage
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await assetRef.set(newAsset);
    return newAsset;
  }

  /**
   * Get Assets for the Marketplace
   * @param {string} type - filter by type (optional)
   * @param {string} access - filter by access (optional, e.g. 'Free')
   */
  async getMarketplaceAssets(type, access) {
    let query = admin
      .firestore()
      .collection("ASSET")
      .where("isApproved", "==", true);

    if (type) {
      query = query.where("type", "==", type);
    }

    if (access) {
      query = query.where("access", "==", access);
    }

    const snapshot = await query.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Get Assets created by a specific Creator
   */
  async getMyAssets(uid) {
    const snapshot = await admin
      .firestore()
      .collection("ASSET")
      .where("creatorId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Admin: Approve an Asset
   */
  async approveAsset(assetId) {
    const assetRef = admin.firestore().collection("ASSET").doc(assetId);
    await assetRef.update({
      isApproved: true,
    });
    return { success: true };
  }

  /**
   * Get Single Asset
   */
  async getAssetById(assetId) {
    const doc = await admin.firestore().collection("ASSET").doc(assetId).get();
    return doc.exists ? doc.data() : null;
  }
}

module.exports = new AssetService();
