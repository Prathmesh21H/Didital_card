"use client";
import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import LiveDemo from "@/components/LiveDemo";

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login"); // 'login' or 'signup'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (view) => {
    setAuthView(view);
    setIsAuthOpen(true);
  };

  return (
    <div className="font-sans antialiased bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <Navigation isScrolled={isScrolled} onOpenAuth={openAuth} />
      <main>
        <Hero onOpenAuth={openAuth} />
        <Features />
        <LiveDemo onOpenAuth={openAuth} />
      </main>
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </div>
  );
};

export default App;
