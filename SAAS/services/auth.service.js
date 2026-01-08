var admin = require("../config/firebaseAdmin");
var nodemailer = require("nodemailer");

class AuthService {
  async sendOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Save to Firestore (Temporary Storage)
    await admin
      .firestore()
      .collection("temp_verifications")
      .doc(email)
      .set({
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
      });

    // 2. Configure Email Transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Digital Card App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
      html: `<p>Your verification code is: <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP sent to ${email}`);
      return { success: true, message: "OTP sent successfully" };
    } catch (error) {
      console.error("❌ Email send error:", error);
      throw new Error("Failed to send email. Please check your connection.");
    }
  }

  async verifyOtp(email, otp) {
    const doc = await admin
      .firestore()
      .collection("temp_verifications")
      .doc(email)
      .get();

    if (!doc.exists) {
      return { success: false, message: "No OTP found for this email." };
    }

    const data = doc.data();

    if (data.otp === otp && Date.now() < data.expiresAt) {
      return { success: true };
    } else {
      return { success: false, message: "Invalid or expired OTP." };
    }
  }

  async registerUser(userData, password) {
    const db = admin.firestore();

    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: password,
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    const uid = userRecord.uid;

    const domain = userData.email.split("@")[1];
    const entRef = db.collection("ENTERPRISE");
    const entSnapshot = await entRef
      .where("domainVerified", "==", domain)
      .get();

    const enterpriseId = !entSnapshot.empty ? entSnapshot.docs[0].id : null;

    const determinedPlan = enterpriseId ? "Enterprise" : "Free";

    const finalData = {
      uid: uid,
      name: {
        first: userData.firstName,
        middle: userData.middleName || "",
        last: userData.lastName,
      },
      email: userData.email,
      phone: userData.phone,
      designation: userData.designation,
      company: userData.company,
      website: userData.website || null,
      socialLinks: userData.socialLinks || {},
      profilePhoto: userData.profilePhoto,
      subscriptionPlan: determinedPlan, // Fixed
      enterpriseId: enterpriseId || null,
      role: enterpriseId ? "EnterpriseUser" : "User", // Good practice to add role
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("USAGE").doc(uid).set({
      userId: uid,
      cardsCreated: 0,
      assetsUsed: 0,
      scansCount: 0,
      aiCreditsUsed: 0,
    });

    await db.collection("USER").doc(uid).set(finalData);

    return finalData;
  }
}

module.exports = new AuthService();
