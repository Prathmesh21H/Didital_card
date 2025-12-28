import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = ({ onOpenAuth }) => (
  <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-slate-50 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 animate-fade-in-up">
          🚀 The Future of Networking is Here
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
          Share your identity with a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            single scan.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed px-4">
          Create a stunning digital business card in seconds. Share it via QR
          code, NFC, or link. No app required for receivers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <button
            onClick={() => onOpenAuth("signup")}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Create Your Card <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
