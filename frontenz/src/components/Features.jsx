import React, { useState, useEffect } from "react";
import { FeatureCard } from "./FeatureCard";
import { Share2, Zap, Globe } from "lucide-react";

const Features = () => (
  <section id="features" className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Why go digital?
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Paper business cards are outdated. Upgrade to a solution that grows
          with your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Share2 />}
          title="Instant Sharing"
          description="Share your card via QR code, text, email, or NFC tap. No app needed for the other person."
        />
        <FeatureCard
          icon={<Zap />}
          title="Always Updated"
          description="Changed your number? Update your card instantly. No need to reprint expensive paper cards."
        />
        <FeatureCard
          icon={<Globe />}
          title="Eco-Friendly"
          description="Save trees and reduce waste. 88% of paper business cards are thrown away within a week."
        />
      </div>
    </div>
  </section>
);
export default Features;
