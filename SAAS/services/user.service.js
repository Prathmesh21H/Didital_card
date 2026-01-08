// services/user.service.js
const admin = require("firebase-admin");

class UserService {
  async getUser(uid) {
    const userDoc = await admin.firestore().collection("USER").doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data();
  }

  async updateUser(uid, updateData) {
    const userRef = admin.firestore().collection("USER").doc(uid);

    await userRef.set(
      {
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const updatedDoc = await userRef.get();
    return updatedDoc.data();
  }

  async deleteUser(uid) {
    await admin.firestore().collection("USER").doc(uid).delete();
    await admin.auth().deleteUser(uid);
    return { success: true };
  }

  async registerOAuthDetails(uid, profileData) {
    const domain = profileData.email.split("@")[1];

    const entSnapshot = await admin
      .firestore()
      .collection("ENTERPRISE")
      .where("domainVerified", "==", domain)
      .get();
    const enterpriseId = !entSnapshot.empty ? entSnapshot.docs[0].id : null;

    const newProfile = {
      uid,
      name: {
        first: profileData.firstName,
        middle: profileData.middleName || null,
        last: profileData.lastName,
      },
      email: profileData.email,
      phone: profileData.phone,
      designation: profileData.designation,
      company: profileData.company,
      website: profileData.website || null,
      socialLinks: profileData.socialLinks || {},
      profilePhoto: profileData.profilePhoto || null,
      subscriptionPlan: enterpriseId ? "Enterprise" : "Free",
      enterpriseId: enterpriseId,
      role: enterpriseId ? "EnterpriseUser" : "User",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection("USER").doc(uid).set(newProfile);
    return newProfile;
  }
}

module.exports = new UserService();
