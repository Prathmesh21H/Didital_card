import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  selectPlan,
  getSubscription,
  confirmPayment,
  downgradeToFree,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/select", requireAuth, selectPlan);
router.post("/confirm-payment", requireAuth, confirmPayment);
router.post("/downgrade", requireAuth, downgradeToFree);
router.get("/", requireAuth, getSubscription);

export default router;
