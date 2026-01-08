const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card.controller");
const { verifyToken } = require("../middleware/auth.middleware");
// const { checkCardLimit } = require("../middleware/planGuard"); // Optional extra layer

// Public Route: Anyone can view a card via QR/Link
router.get("/view/:id", cardController.getCard);

// Protected Routes
router.use(verifyToken);

// Create Card (Service layer handles limit checks)
router.post("/", cardController.createCard);

// Get My Cards
router.get("/my-cards", cardController.getMyCards);

// Get Specific Card (for editing)
router.get("/:id", cardController.getCard);

// Update Card
router.patch("/:id", cardController.updateCard);

// Delete Card
router.delete("/:id", cardController.deleteCard);

module.exports = router;
