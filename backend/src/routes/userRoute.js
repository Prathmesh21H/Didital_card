import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { upsertUser, getUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", requireAuth, upsertUser);
router.get("/:email", requireAuth, getUser);

export default router;
