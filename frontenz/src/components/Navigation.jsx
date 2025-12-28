import React, { useState } from "react";
import { Zap, X, Menu } from "lucide-react";

const Navigation = ({ isScrolled, onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 z-10">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="size-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-900">
              NexCard
            </span>
          </div>

          {/* Centered Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-blue-600 font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-blue-600 font-medium"
            >
              Subscription
            </a>
            <a
              href="#terms"
              className="text-slate-600 hover:text-blue-600 font-medium"
            >
              Terms & Conditions
            </a>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4 z-10">
            <button
              onClick={() => onOpenAuth("login")}
              className="text-slate-700 hover:text-blue-600 font-medium px-4 py-2"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuth("signup")}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-900 z-10 p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col space-y-4 shadow-lg animate-fade-in z-40">
          <a
            href="#features"
            className="text-slate-600 font-medium p-2 block hover:bg-slate-50 rounded-lg"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-slate-600 font-medium p-2 block hover:bg-slate-50 rounded-lg"
          >
            Subscription
          </a>
          <a
            href="#terms"
            className="text-slate-600 font-medium p-2 block hover:bg-slate-50 rounded-lg"
          >
            Terms & Conditions
          </a>
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                onOpenAuth("login");
                setIsOpen(false);
              }}
              className="text-slate-700 font-medium py-3 text-center border border-slate-200 rounded-xl"
            >
              Log In
            </button>
            <button
              onClick={() => {
                onOpenAuth("signup");
                setIsOpen(false);
              }}
              className="bg-blue-600 text-white w-full py-3 rounded-xl font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navigation;
