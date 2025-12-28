import React from "react";
import {
  Zap,
  Linkedin,
  Twitter,
  Github,
  Image as ImageIcon,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-blue-600 p-1.5 rounded">
              <Zap className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold">NexCard</span>
          </div>
          <p className="text-slate-400 max-w-sm">
            The modern way to connect. Create, share, and track your digital
            business cards with ease.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Enterprise
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
        <p>&copy; 2024 NexCard Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-white">
            <Linkedin size={20} />
          </a>
          <a href="#" className="hover:text-white">
            <Github size={20} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
