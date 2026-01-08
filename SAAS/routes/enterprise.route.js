const express = require("express");
const router = express.Router();
const entController = require("../controllers/enterprise.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

// Create new Enterprise Account
router.post("/create", entController.registerEnterprise);

// Get Enterprise Billing Dashboard
router.get("/:id/dashboard", entController.getDashboard);

module.exports = router;
