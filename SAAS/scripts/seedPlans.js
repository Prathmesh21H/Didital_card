const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Your Firebase key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const plans = [
  {
    planId: "Free",
    planName: "Free Tier",
    maxCards: 1,
    allowCustomSlug: false,
    allowAnimations: false,
    allowMarketplace: false,
    aiCredits: 0,
    priceMonthly: 0,
    priceYearly: 0,
  },
  {
    planId: "Pro",
    planName: "Pro Tier",
    maxCards: 10,
    allowCustomSlug: true,
    allowAnimations: true,
    allowMarketplace: true,
    aiCredits: 50,
    priceMonthly: 9.99,
    priceYearly: 99.99,
  },
  {
    planId: "Enterprise",
    planName: "Enterprise",
    maxCards: -1, // Infinite
    allowCustomSlug: true,
    allowAnimations: true,
    allowMarketplace: true,
    aiCredits: 500,
    priceMonthly: 0, // Billed via Invoice
    priceYearly: 0,
  },
];

async function seed() {
  const batch = db.batch();
  plans.forEach((plan) => {
    const ref = db.collection("PLAN_CONFIG").doc(plan.planId);
    batch.set(ref, plan);
  });
  await batch.commit();
  console.log("✅ Plans Seeded Successfully");
}

seed();
