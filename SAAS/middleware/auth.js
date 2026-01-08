// middleware/auth.middleware.js
const admin = require("firebase-admin");

/**
 * Middleware to verify Firebase ID Tokens
 * Expects Header: Authorization: Bearer <token>
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No token provided",
    });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // verifyIdToken checks the signature and expiration
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || "User", // Access custom claims if you've set them
    };

    next(); // Pass control to the next controller/middleware
  } catch (error) {
    console.error("Error verifying Firebase token:", error);

    // Handle specific error cases
    if (error.code === "auth/id-token-expired") {
      return res
        .status(401)
        .json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }

    return res
      .status(403)
      .json({ error: "Forbidden", message: "Invalid token" });
  }
};

module.exports = { verifyToken };
