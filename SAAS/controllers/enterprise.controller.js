// controllers/enterprise.controller.js
const EnterpriseService = require("../services/enterprise.service");

exports.registerEnterprise = async (req, res) => {
  try {
    const { name, domainVerified, pricePerUser, pricePerRoom } = req.body;

    if (!name || !domainVerified) {
      return res.status(400).json({ error: "Name and Domain are required" });
    }

    const enterprise = await EnterpriseService.createEnterprise(
      req.user.uid,
      req.body
    );
    res.status(201).json(enterprise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Only allow if user is part of that enterprise
    const enterpriseId = req.params.id; // or from req.user.enterpriseId

    if (req.user.role !== "EnterpriseAdmin") {
      return res.status(403).json({ error: "Access Denied" });
    }

    const data = await EnterpriseService.getBillingOverview(enterpriseId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
