const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

// Create Room (Triggers Billing Event)
router.post("/create", roomController.createRoom);

// Join existing room
router.post("/:roomId/join", roomController.joinRoom);

// Get Room Info & Members
router.get("/:roomId", roomController.getRoom);

module.exports = router;
