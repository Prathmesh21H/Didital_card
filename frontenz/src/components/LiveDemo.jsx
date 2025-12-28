import React, { useState } from "react";
import { CardPreview } from "./CardPreview";
import {
  Smartphone,
  Share2,
  Zap,
  Globe,
  ArrowRight,
  Menu,
  X,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Phone,
  CheckCircle,
  User,
  Image as ImageIcon,
  Layout,
  Palette,
  Upload,
  Lock,
  Chrome,
  Apple,
  ArrowLeft,
} from "lucide-react";

const LiveDemo = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    profileUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    banner: { type: "color", value: "#2563EB" },
    fontStyle: "basic",
    cardSkin: null,
    layout: "minimal",
    fullName: "Alex Rivera",
    designation: "Product Designer",
    company: "Creative Studio",
    bio: "Passionate about creating intuitive digital experiences. Let's build something amazing together.",
    phone: "+1 (555) 000-0000",
    email: "alex@creativestudio.co",
    website: "alexrivera.design",
    linkedin: "https://linkedin.com/in/alex",
    twitter: "@alex",
    instagram: "",
    facebook: "",
  });

  const bannerColors = [
    "#2563EB",
    "#7C3AED",
    "#DB2777",
    "#059669",
    "#DC2626",
    "#0F172A",
    "#F59E0B",
    "#14B8A6",
  ];

  const skinPatterns = [
    { name: "None", url: null },
    {
      name: "Abstract",
      url: "https://img.freepik.com/free-vector/white-abstract-background_23-2148810113.jpg",
    },
    {
      name: "Geometric",
      url: "https://img.freepik.com/free-vector/white-gray-geometric-pattern-background-vector_53876-136510.jpg",
    },
    {
      name: "Marble",
      url: "https://img.freepik.com/free-photo/white-marble-texture-background_23-2148825001.jpg",
    },
    {
      name: "Gradient",
      url: "https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149001474.jpg",
    },
  ];

  const fonts = [
    { id: "basic", name: "Basic (Sans)", class: "font-sans" },
    { id: "serif", name: "Elegant (Serif)", class: "font-serif" },
    { id: "mono", name: "Tech (Mono)", class: "font-mono" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateBanner = (type, value) => {
    setFormData({ ...formData, banner: { type, value } });
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
        activeTab === id
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <section id="demo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Try it yourself
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Design your perfect digital card. Customize every detail from layout
            to colors.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16">
          {/* Editor Panel */}
          <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px] lg:min-h-[600px] order-2 lg:order-1">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-white scrollbar-hide flex-shrink-0">
              <TabButton
                id="profile"
                label="Profile"
                icon={<User size={18} />}
              />
              <TabButton
                id="banner"
                label="Banner"
                icon={<ImageIcon size={18} />}
              />
              <TabButton
                id="design"
                label="Design"
                icon={<Layout size={18} />}
              />
              <TabButton
                id="skins"
                label="Card Skin"
                icon={<Palette size={18} />}
              />
            </div>

            {/* Tab Content Area */}
            <div className="p-6 md:p-8 flex-grow overflow-y-auto">
              {/* --- PROFILE TAB --- */}
              {activeTab === "profile" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        DESIGNATION
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      COMPANY
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      BIO
                    </label>
                    <textarea
                      name="bio"
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        PHONE
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- BANNER TAB --- */}
              {activeTab === "banner" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      Solid Colors
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Choose a brand color for your banner.
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                      {bannerColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => updateBanner("color", c)}
                          className={`size-10 rounded-full transition-transform hover:scale-110 shadow-sm ${
                            formData.banner.type === "color" &&
                            formData.banner.value === c
                              ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                              : ""
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      Custom Image
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Or paste an image URL for a custom look.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/banner.jpg"
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        onChange={(e) => updateBanner("image", e.target.value)}
                      />
                      <button className="bg-slate-100 p-2 rounded-lg border border-slate-200 text-slate-600">
                        <Upload size={20} />
                      </button>
                    </div>
                    {formData.banner.type === "image" &&
                      formData.banner.value && (
                        <div className="mt-4 h-32 w-full rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200">
                          <img
                            src={formData.banner.value}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Active
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* --- DESIGN TAB --- */}
              {activeTab === "design" && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">
                      Layout Style
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {["minimal", "modern", "creative"].map((l) => (
                        <div
                          key={l}
                          onClick={() =>
                            setFormData({ ...formData, layout: l })
                          }
                          className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${
                            formData.layout === l
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="h-16 bg-slate-200 rounded-md mb-2 overflow-hidden relative">
                            {/* Mini representations of layouts */}
                            {l === "minimal" && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 rounded-full bg-slate-400 border-2 border-white"></div>
                            )}
                            {l === "modern" && (
                              <div className="absolute top-4 left-2 size-8 rounded-md bg-slate-400 border-2 border-white"></div>
                            )}
                            {l === "creative" && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 rounded-full bg-slate-400 opacity-50"></div>
                            )}
                          </div>
                          <span className="text-sm font-medium capitalize text-slate-700">
                            {l}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">
                      Typography
                    </h3>
                    <div className="space-y-3">
                      {fonts.map((f) => (
                        <div
                          key={f.id}
                          onClick={() =>
                            setFormData({ ...formData, fontStyle: f.id })
                          }
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.fontStyle === f.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className={`text-slate-800 ${f.class} text-lg`}>
                            Aa
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            {f.name}
                          </span>
                          {formData.fontStyle === f.id && (
                            <CheckCircle size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SKINS TAB --- */}
              {activeTab === "skins" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      Background Skins
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Select a pattern or texture for your card.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skinPatterns.map((skin, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setFormData({ ...formData, cardSkin: skin.url })
                          }
                          className={`aspect-square rounded-xl border-2 cursor-pointer overflow-hidden relative transition-all ${
                            formData.cardSkin === skin.url
                              ? "border-blue-600 ring-2 ring-blue-100"
                              : "border-slate-200"
                          }`}
                        >
                          {skin.url ? (
                            <img
                              src={skin.url}
                              alt={skin.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                              None
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 w-full bg-black/60 p-1 text-center">
                            <span className="text-[10px] text-white font-medium uppercase">
                              {skin.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-2">
                      Custom Skin URL
                    </h3>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.cardSkin || ""}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      onChange={(e) =>
                        setFormData({ ...formData, cardSkin: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="border-t border-slate-200 p-6 bg-slate-50 mt-auto flex-shrink-0">
              <button
                onClick={() => onOpenAuth("signup")}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                Let's Get Started <ArrowRight className="size-5" />
              </button>
              <p className="text-center text-slate-400 text-sm mt-3">
                Create your account to save your design.
              </p>
            </div>
          </div>

          {/* Live Preview */}
          <div className="w-full lg:w-1/2 flex justify-center lg:sticky lg:top-24 order-1 lg:order-2">
            <CardPreview data={formData} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};
export default LiveDemo;
