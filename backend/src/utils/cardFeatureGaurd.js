// utils/cardFeatureGaurd.js
export const validateCardFeatures = (subscription, card) => {
  const plan = subscription.plan;

  if (plan === "FREE") {
    if (card.banner?.type === "image") return "Image banner not allowed on Free plan";
    if (card.fontStyle !== "basic") return "Only basic font allowed on Free plan";
    if (card.cardSkin) return "Custom card background not allowed on Free plan";
    if (card.layout !== "minimal") return "Only minimal layout allowed on Free plan";
  }

  if (plan === "PRO") {
    if (card.banner?.type === "image") return "Image banner requires Premium plan";
    if (card.layout === "creative") return "Creative layout requires Premium plan";
  }

  // PREMIUM has no restrictions
  return null;
};
