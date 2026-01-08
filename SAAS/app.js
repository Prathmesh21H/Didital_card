var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// --- 1. SECURITY PACKAGES ---
var helmet = require("helmet");
var cors = require("cors");
var rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cardRoutes = require("./routes/card.routes");
const subRoutes = require("./routes/subscription.routes");
const assetRoutes = require("./routes/asset.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const scanRoutes = require("./routes/scan.routes");
const enterpriseRoutes = require("./routes/enterprise.routes");
const roomRoutes = require("./routes/room.routes");

var app = express();

// --- 2. SECURITY MIDDLEWARE SETUP ---

// A. Helmet: Sets various HTTP headers to secure the app (XSS, HSTS, etc.)
app.use(helmet());

// B. CORS: Allow requests from your Frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Restrict to your frontend domain
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true, // Allow cookies/headers
  })
);

// C. General Rate Limiter (Apply to all requests)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(globalLimiter);

// D. Strict Auth Rate Limiter (Prevent Brute Force)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/signup attempts per hour
  message: "Too many login attempts, please try again later.",
});

// --- STANDARD MIDDLEWARE ---
app.use(logger("dev"));
app.use(express.json({ limit: "10kb" })); // Security: Limit body size to prevent DoS
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- ROUTES ---

// Apply strict limiter ONLY to auth routes
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/user", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/subscription", subRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/enterprise", enterpriseRoutes);
app.use("/api/rooms", roomRoutes);

// --- ERROR HANDLING ---

app.use(function (req, res, next) {
  next(createError(404));
});

// Updated Error Handler to return JSON (Better for APIs)
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const errorResponse = {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  };

  // Render JSON instead of HTML view (since this is an API)
  res.status(err.status || 500);
  res.json(errorResponse);
});

module.exports = app;
