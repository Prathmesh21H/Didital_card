// controllers/room.controller.js
const RoomService = require("../services/room.service");

exports.createRoom = async (req, res) => {
  try {
    const room = await RoomService.createRoom(req.user.uid, req.body);
    res.status(201).json({ message: "Room created & Enterprise billed", room });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    await RoomService.addMember(req.params.roomId, req.user.uid);
    res.status(200).json({ message: "Joined room successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const data = await RoomService.getRoomDetails(req.params.roomId);
    if (!data) return res.status(404).json({ error: "Room not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
