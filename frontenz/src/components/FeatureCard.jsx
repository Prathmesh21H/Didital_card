import React from "react";

export const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
    <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);
