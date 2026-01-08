// middleware/planGuard.js
const SubscriptionService = require("../services/subscription.service");

const checkCardLimit = async (req, res, next) => {
  try {
    const canCreate = await SubscriptionService.canPerformAction(
      req.user.uid,
      "CREATE_CARD"
    );

    if (!canCreate) {
      return res.status(403).json({
        error: "Limit Reached",
        message:
          "You have reached the maximum cards allowed for your plan. Please upgrade.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { checkCardLimit };
