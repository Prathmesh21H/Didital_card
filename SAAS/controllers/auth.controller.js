const AuthService = require("../services/auth.service");

exports.requestOTP = async (req, res) => {
  try {
    await AuthService.sendOTP(req.body.email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeRegistration = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const isValid = await AuthService.verifyOTP(email, otp);
    if (!isValid)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const newUser = await AuthService.registerUser(req.body, password);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
