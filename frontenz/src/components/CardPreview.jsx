"use client";

import React from "react";
import { Smartphone, Linkedin, Mail, Phone, Globe } from "lucide-react";

export const CardPreview = ({ data }) => {
  // --- SAFE AVATAR LOGIC ---
  const displayAvatar = data.profileUrl?.trim()
    ? data.profileUrl
    : `https://api.dicebear.com/7.x/initials/svg?seed=${
        data.fullName || "User"
      }`;

  // --- LAYOUT STYLES ---
  const getLayoutClasses = () => {
    switch (data.layout) {
      // --- NEW TEMPLATES ---
      case "corporate":
        return {
          // FIXED: Removed 'bg-white'
          container: "flex h-full text-left relative overflow-hidden",
          sidebar:
            "bg-slate-800 w-1/3 h-full absolute left-0 top-0 bottom-0 flex flex-col items-center pt-8 z-10 text-white",
          mainContent: "ml-[33%] w-2/3 h-full p-5 pt-12 overflow-y-auto",
          avatarWrapper:
            "size-16 rounded-full border-2 border-white/20 mb-4 overflow-hidden bg-slate-200",
          info: "mt-0",
          links: "mt-6 space-y-3",
        };

      case "glass":
        return {
          // Default gradient if no skin, otherwise transparent to let skin show
          container: `text-center h-full relative z-10 flex flex-col items-center pt-12 ${
            !data.cardSkin
              ? "bg-gradient-to-br from-indigo-100 to-purple-100"
              : ""
          }`,
          avatarWrapper:
            "size-28 rounded-2xl border border-white/60 shadow-xl backdrop-blur-md bg-white/30 mb-6 overflow-hidden",
          info: "bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg mx-4 w-[85%]",
          links: "mt-6 w-[85%] space-y-3 pb-8",
        };

      case "elegant":
        return {
          // FIXED: Removed 'bg-white', added slight opacity for readability
          container:
            "text-center h-full border-[6px] border-double border-slate-800 m-3 bg-white/90 flex flex-col",
          header: "h-40 relative flex items-end justify-center",
          avatarWrapper:
            "absolute -bottom-10 left-1/2 transform -translate-x-1/2 size-28 border border-slate-800 bg-white p-1.5 shadow-sm z-20 rotate-45",
          innerAvatar: "w-full h-full object-cover -rotate-45",
          info: "mt-14 px-6",
          links: "mt-8 px-6 space-y-3 pb-8",
        };

      // --- EXISTING LAYOUTS ---
      case "modern":
        return {
          // FIXED: Removed 'bg-white'
          container: "text-left min-h-full",
          header: "h-32 relative",
          avatarWrapper:
            "absolute -bottom-12 left-6 size-24 rounded-xl border-4 border-white bg-slate-200 overflow-hidden shadow-md z-10",
          info: "mt-16 px-6",
          links: "mt-8 px-6 space-y-3 pb-8",
        };
      case "creative":
        return {
          // FIXED: Removed 'bg-white', kept blur
          container: "text-center backdrop-blur-sm min-h-full",
          header: "h-40 relative flex justify-center items-center",
          avatarWrapper:
            "absolute -bottom-14 left-1/2 transform -translate-x-1/2 size-28 rounded-full border-4 border-white/50 backdrop-blur-sm bg-slate-200 overflow-hidden shadow-xl z-10",
          info: "mt-16 px-6",
          links: "mt-8 px-6 space-y-3 pb-8",
        };
      case "minimal":
      default:
        return {
          // FIXED: Removed 'bg-white'
          container: "text-center min-h-full",
          header: "h-32 relative",
          avatarWrapper:
            "absolute -bottom-12 left-1/2 transform -translate-x-1/2 size-24 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md",
          info: "mt-14 px-6",
          links: "mt-8 px-6 space-y-3 pb-8",
        };
    }
  };

  // --- FONT LOGIC (6 Styles) ---
  const getFontFamily = () => {
    switch (data.fontStyle) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      case "script":
        return "font-serif italic";
      case "wide":
        return "font-sans tracking-widest uppercase";
      case "bold":
        return "font-sans font-black";
      case "basic":
      default:
        return "font-sans";
    }
  };

  const layout = getLayoutClasses();
  const fontFamily = getFontFamily();

  // --- DYNAMIC STYLES ---
  const bannerStyle =
    data.banner?.type === "image"
      ? {
          backgroundImage: `url(${data.banner.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { backgroundColor: data.banner?.value || "#2563eb" };

  // Apply Skin Logic
  const skinStyle = data.cardSkin
    ? data.cardSkin.startsWith("#")
      ? { backgroundColor: data.cardSkin }
      : {
          backgroundImage: `url(${data.cardSkin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
    : { backgroundColor: "white" }; // Default white if no skin

  return (
    <div className="relative group perspective-1000 scale-[0.8] sm:scale-90 md:scale-100 origin-top">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* Phone Frame */}
      <div className="relative mx-auto border-slate-900 bg-slate-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 group-hover:rotate-1 group-hover:scale-[1.01]">
        <div className="h-[32px] bg-slate-900 w-full absolute top-0 left-0 z-20 flex justify-center">
          <div className="h-[18px] w-[120px] bg-black rounded-b-2xl"></div>
        </div>

        {/* Screen */}
        <div
          className={`flex-1 overflow-y-auto hide-scrollbar relative z-10 ${fontFamily}`}
          style={skinStyle}
        >
          {/* --- CORPORATE LAYOUT --- */}
          {data.layout === "corporate" ? (
            <div className={layout.container}>
              <div className={layout.sidebar} style={bannerStyle}>
                <div className={layout.avatarWrapper}>
                  <img
                    src={displayAvatar}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-4 text-center text-white/80">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">
                    Scan
                  </p>
                  <div className="size-16 bg-white/10 p-1 mx-auto rounded border border-white/20 flex items-center justify-center">
                    <div className="size-full bg-white flex items-center justify-center text-[6px] text-slate-900 font-bold">
                      QR
                    </div>
                  </div>
                </div>
              </div>
              <div className={layout.mainContent}>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">
                  {data.fullName || "Your Name"}
                </h3>
                <p className="text-blue-600 font-medium text-xs mt-1 mb-3">
                  {data.designation || "Job Title"}
                </p>
                <div className="w-8 h-1 bg-slate-200 mb-4"></div>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 normal-case tracking-normal font-normal">
                  {data.bio || "Professional summary."}
                </p>
                <div className="space-y-2">
                  <ContactRow
                    icon={<Phone size={12} />}
                    label="Mobile"
                    value={data.phone}
                  />
                  <ContactRow
                    icon={<Mail size={12} />}
                    label="Email"
                    value={data.email}
                  />
                  <ContactRow
                    icon={<Globe size={12} />}
                    label="Web"
                    value={data.website}
                  />
                </div>
                <div className="mt-6">
                  <SaveBtn
                    color={
                      data.banner?.type === "color"
                        ? data.banner.value
                        : "#1e293b"
                    }
                  />
                </div>
              </div>
            </div>
          ) : data.layout === "glass" ? (
            /* --- GLASS LAYOUT --- */
            <div className={layout.container}>
              <div className={layout.avatarWrapper}>
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className={layout.info}>
                <h3 className="text-lg font-bold text-slate-900">
                  {data.fullName || "Your Name"}
                </h3>
                <p className="text-xs font-medium text-slate-600 mb-2">
                  {data.designation || "Job Title"}
                </p>
                <p className="text-[10px] text-slate-500 normal-case tracking-normal font-normal">
                  {data.bio || "Brief bio."}
                </p>
              </div>
              <div className={layout.links}>
                <GlassLink
                  icon={<Phone size={14} />}
                  value={data.phone}
                  label="Phone"
                />
                <GlassLink
                  icon={<Mail size={14} />}
                  value={data.email}
                  label="Email"
                />
                <GlassLink
                  icon={<Globe size={14} />}
                  value={data.website}
                  label="Website"
                />
                <div className="pt-2">
                  <SaveBtn color="#334155" glass={true} />
                </div>
              </div>
            </div>
          ) : data.layout === "elegant" ? (
            /* --- ELEGANT LAYOUT --- */
            <div className={layout.container}>
              <div className={layout.header} style={bannerStyle}>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
              </div>
              <div className="relative w-full">
                <div className={layout.avatarWrapper}>
                  <img
                    src={displayAvatar}
                    alt="Avatar"
                    className={layout.innerAvatar}
                  />
                </div>
              </div>
              <div className={layout.info}>
                <h3 className="text-xl font-bold text-slate-900 tracking-wider uppercase border-b border-slate-900 pb-2 inline-block mb-2">
                  {data.fullName || "Your Name"}
                </h3>
                <p className="text-xs italic text-slate-600 font-serif mb-4">
                  {data.designation || "Job Title"}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed italic px-2 font-serif">
                  {data.bio ||
                    "Elegance is not standing out, but being remembered."}
                </p>
              </div>
              <div className={layout.links}>
                <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-3 mb-4">
                  <SimpleIconLink icon={<Phone size={16} />} />
                  <SimpleIconLink icon={<Mail size={16} />} />
                  <SimpleIconLink icon={<Globe size={16} />} />
                </div>
                <SaveBtn color="#1e293b" />
              </div>
            </div>
          ) : (
            /* --- STANDARD LAYOUTS --- */
            <div
              className={`min-h-full ${
                data.layout === "creative" ? "bg-white/80" : ""
              }`}
            >
              <div
                className={`${layout.header} w-full transition-all duration-300`}
                style={bannerStyle}
              >
                {data.banner?.type === "image" && (
                  <div className="absolute inset-0 bg-black/10"></div>
                )}
                {(data.layout === "minimal" || data.layout === "creative") && (
                  <div className={layout.avatarWrapper}>
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {data.layout === "modern" && (
                  <div className={layout.avatarWrapper}>
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className={`${layout.container} ${layout.info}`}>
                <h3 className="text-xl font-bold text-slate-900">
                  {data.fullName || "Your Name"}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {data.designation || "Job Title"}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {data.company || "Company Name"}
                </p>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed line-clamp-3 normal-case tracking-normal font-normal">
                  {data.bio || "Brief bio."}
                </p>
              </div>
              <div className={layout.links}>
                <StandardLink
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={data.phone}
                />
                <StandardLink
                  icon={<Mail size={16} />}
                  label="Email"
                  value={data.email}
                />
                <StandardLink
                  icon={<Globe size={16} />}
                  label="Web"
                  value={data.website}
                />
                <div className="pt-4 pb-4">
                  <SaveBtn
                    color={
                      data.banner?.type === "color"
                        ? data.banner.value
                        : "#2563EB"
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---
const SaveBtn = ({ color, glass }) => (
  <button
    style={{ backgroundColor: glass ? "rgba(30,41,59,0.9)" : color }}
    className={`w-full py-2.5 rounded-xl text-white font-bold shadow-md flex items-center justify-center gap-2 ${
      glass ? "backdrop-blur-md border border-white/20" : ""
    }`}
  >
    <Smartphone size={16} /> <span className="text-xs">Save Contact</span>
  </button>
);
const ContactRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 overflow-hidden">
    <div className="text-slate-400 shrink-0">{icon}</div>
    <div className="text-xs truncate w-full">
      <span className="font-bold text-slate-700 mr-1">{label}:</span>
      <span className="text-slate-500 font-sans tracking-normal font-normal">
        {value || "-"}
      </span>
    </div>
  </div>
);
const GlassLink = ({ icon, value, label }) => (
  <div className="flex items-center p-2.5 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl shadow-sm">
    <div className="size-6 rounded-full bg-white/60 flex items-center justify-center text-slate-700 mr-3 shrink-0">
      {icon}
    </div>
    <div className="text-left overflow-hidden min-w-0">
      <p className="text-[9px] text-slate-600 uppercase font-bold opacity-70">
        {label}
      </p>
      <p className="text-xs font-semibold text-slate-800 truncate font-sans tracking-normal">
        {value || "-"}
      </p>
    </div>
  </div>
);
const SimpleIconLink = ({ icon }) => (
  <div className="flex items-center justify-center p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
    {icon}
  </div>
);
const StandardLink = ({ icon, label, value }) => (
  <div className="flex items-center p-2.5 bg-white/80 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
    <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-3 shrink-0">
      {icon}
    </div>
    <div className="text-left overflow-hidden">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-xs font-semibold text-slate-800 truncate font-sans tracking-normal">
        {value || "-"}
      </p>
    </div>
  </div>
);

export default CardPreview;
