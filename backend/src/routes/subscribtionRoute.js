import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  selectPlan,
  getSubscription,
  confirmPayment,
  downgradeToFree,
} from "../controllers/subscribtionController.js";

const router = express.Router();

// Select FREE / start paid plan
router.post("/select", requireAuth, selectPlan);

// DEMO payment confirmation (Stripe/Razorpay ready)
router.post("/confirm-payment", requireAuth, confirmPayment);

// Downgrade
router.post("/downgrade", requireAuth, downgradeToFree);

// Get current subscription
router.get("/", requireAuth, getSubscription);

export default router;
