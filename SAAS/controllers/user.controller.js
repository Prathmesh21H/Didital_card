// controllers/user.controller.js
const UserService = require("../services/user.service");

exports.getProfile = async (req, res) => {
  try {
    const uid = req.user.uid; // From Auth Middleware
    const profile = await UserService.getUser(uid);

    if (!profile) {
      return res.status(200).json({
        exists: false,
        message: "Profile not found. Please complete registration.",
      });
    }

    res.status(200).json({ exists: true, data: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await UserService.updateUser(req.user.uid, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerOAuthProfile = async (req, res) => {
  try {
    const profile = await UserService.registerOAuthDetails(
      req.user.uid,
      req.body
    );
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
