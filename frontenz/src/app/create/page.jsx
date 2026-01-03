"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardPreview } from "@/components/CardPreview";
import {
  User,
  Palette,
  ArrowRight,
  Type,
  ImageIcon,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { cardAPI, setAuthToken } from "@/lib/api";
import axios from "axios";

export default function CreateCardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    profileUrl: "",
    banner: { type: "color", value: "#2563eb" },
    fontStyle: "basic",
    cardSkin: "",
    layout: "minimal",
    fullName: "",
    designation: "",
    company: "",
    bio: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  // --- CONFIGURATION ---
  const CLOUDINARY_UPLOAD_PRESET = "DigitalCard";
  const CLOUDINARY_CLOUD_NAME = "dmow3iq7c";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateBanner = (type, value) => {
    setForm({ ...form, banner: { type, value } });
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB. Please choose a smaller image.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;
      setForm((prev) => ({ ...prev, profileUrl: imageUrl }));
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, profileUrl: "" }));
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to create a card.");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      setAuthToken(token);

      const response = await cardAPI.createCard(form);
      const cardId = response.data.id || response.data.cardId;

      if (cardId) {
        router.push(`/dashboard`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Create Card Error:", err);
      if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data?.message;
        if (status === 403) {
          setError("Card limit reached. Upgrade your plan.");
        } else if (status === 401) {
          setError("You must be logged in.");
        } else {
          setError(errorMessage || `Server Error: ${status}`);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FONT OPTIONS DATA ---
  const fontOptions = [
    { id: "basic", label: "Basic", class: "font-sans" },
    { id: "serif", label: "Serif", class: "font-serif" },
    { id: "mono", label: "Mono", class: "font-mono" },
    { id: "script", label: "Script", class: "font-serif italic" },
    {
      id: "wide",
      label: "Wide",
      class: "font-sans tracking-widest uppercase text-[10px]",
    },
    { id: "bold", label: "Bold", class: "font-sans font-black" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Card Builder</h1>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading || uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-200"
          >
            {loading ? "Creating..." : "Publish Card"} <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        {/* Editor Panel */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <TabButton
                active={activeTab === "content"}
                onClick={() => setActiveTab("content")}
                icon={<User size={18} />}
                label="Content"
              />
              <TabButton
                active={activeTab === "design"}
                onClick={() => setActiveTab("design")}
                icon={<Palette size={18} />}
                label="Design"
              />
            </div>

            <div className="p-6 lg:p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              {activeTab === "content" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* --- IDENTITY SECTION --- */}
                  <FormSection title="Identity">
                    {/* Image Upload */}
                    <div className="col-span-1 md:col-span-2 mb-4">
                      <label className="block text-[11px] font-bold text-slate-500 ml-1 uppercase mb-2">
                        Profile Photo
                      </label>
                      <div className="flex items-start gap-6">
                        <div className="relative group shrink-0">
                          <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                            {form.profileUrl ? (
                              <img
                                src={form.profileUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="text-slate-300" size={40} />
                            )}
                          </div>
                          {form.profileUrl && (
                            <button
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group relative">
                            {uploading ? (
                              <div className="flex flex-col items-center text-slate-400">
                                <Loader2
                                  className="animate-spin mb-2"
                                  size={24}
                                />
                                <span className="text-xs font-medium">
                                  Uploading...
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600">
                                <Upload className="mb-2" size={24} />
                                <span className="text-xs font-semibold">
                                  Click to upload image
                                </span>
                                <span className="text-[10px] text-slate-400 mt-1">
                                  JPG, PNG (Max 5MB)
                                </span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Full Name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Designation"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                    />
                    <Input
                      label="Company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </FormSection>

                  {/* --- CONTACT INFO SECTION --- */}
                  <FormSection title="Contact Info">
                    <Input
                      label="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <Input
                      label="Website"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </FormSection>

                  {/* --- SOCIAL MEDIA SECTION (NEW) --- */}
                  <FormSection title="Social Media">
                    <Input
                      label="LinkedIn URL"
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                    <Input
                      label="Twitter (X) URL"
                      name="twitter"
                      value={form.twitter}
                      onChange={handleChange}
                      placeholder="@username or url"
                    />
                    <Input
                      label="Instagram URL"
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      placeholder="@username or url"
                    />
                    <Input
                      label="Facebook URL"
                      name="facebook"
                      value={form.facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/..."
                    />
                  </FormSection>

                  {/* --- BIO SECTION --- */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                      placeholder="Tell people who you are..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* --- LAYOUT SELECTION --- */}
                  <div>
                    <SectionHeading
                      icon={<Type size={18} />}
                      title="Choose Layout"
                    />
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        "minimal",
                        "modern",
                        "creative",
                        "corporate",
                        "glass",
                        "elegant",
                      ].map((layoutName) => (
                        <button
                          key={layoutName}
                          onClick={() =>
                            setForm({ ...form, layout: layoutName })
                          }
                          className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                            form.layout === layoutName
                              ? "border-blue-600 bg-blue-50/50"
                              : "border-slate-100 hover:border-blue-200 bg-white"
                          }`}
                        >
                          <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative shadow-sm border border-slate-200/50">
                            {layoutName === "minimal" && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-50">
                                <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                                <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
                              </div>
                            )}
                            {layoutName === "modern" && (
                              <div className="absolute inset-0 flex flex-col p-2 gap-2 opacity-50">
                                <div className="w-full h-6 bg-slate-300 rounded-t-lg mb-[-10px]"></div>
                                <div className="w-8 h-8 rounded-lg bg-slate-400 border-2 border-white z-10 ml-1"></div>
                              </div>
                            )}
                            {layoutName === "creative" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-400 shadow-sm"></div>
                                </div>
                              </div>
                            )}
                            {layoutName === "corporate" && (
                              <div className="absolute inset-0 flex opacity-60">
                                <div className="w-1/3 h-full bg-slate-600 flex flex-col items-center pt-2 gap-1">
                                  <div className="w-5 h-5 rounded-full bg-white/50"></div>
                                </div>
                                <div className="w-2/3 bg-white"></div>
                              </div>
                            )}
                            {layoutName === "glass" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-60 bg-gradient-to-br from-blue-200 to-purple-200">
                                <div className="w-16 h-10 bg-white/50 backdrop-blur-sm rounded border border-white/60"></div>
                              </div>
                            )}
                            {layoutName === "elegant" && (
                              <div className="absolute inset-0 p-2 flex flex-col items-center justify-center opacity-50">
                                <div className="w-full h-full border border-slate-500 flex items-center justify-center">
                                  <div className="w-6 h-6 rotate-45 border border-slate-500"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold capitalize text-slate-600">
                            {layoutName}
                          </span>
                          {form.layout === layoutName && (
                            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                      {fontOptions.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setForm({ ...form, fontStyle: f.id })}
                          className={`flex items-center justify-center py-3 rounded-lg border text-sm capitalize transition-all ${
                            form.fontStyle === f.id
                              ? "bg-slate-900 text-white border-slate-900 shadow-md"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                          } ${f.class}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionHeading
                      icon={<Palette size={18} />}
                      title="Banner & Brand"
                    />
                    <div className="flex gap-2 mt-4 mb-4">
                      <button
                        onClick={() => updateBanner("color", "#2563eb")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border ${
                          form.banner.type === "color"
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        Color
                      </button>
                      <button
                        onClick={() => updateBanner("image", "")}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border ${
                          form.banner.type === "image"
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        Image
                      </button>
                    </div>
                    {form.banner.type === "color" ? (
                      <div className="flex flex-wrap gap-3">
                        {[
                          "#2563eb",
                          "#7C3AED",
                          "#DB2777",
                          "#059669",
                          "#DC2626",
                          "#0F172A",
                          "#F59E0B",
                        ].map((color) => (
                          <button
                            key={color}
                            onClick={() => updateBanner("color", color)}
                            className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${
                              form.banner.value === color
                                ? "border-white ring-2 ring-blue-500 scale-110"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Input
                        label="Banner Image URL"
                        name="bannerValue"
                        value={form.banner.value}
                        onChange={(e) => updateBanner("image", e.target.value)}
                        placeholder="https://..."
                      />
                    )}
                  </div>

                  <div>
                    <SectionHeading
                      icon={<ImageIcon size={18} />}
                      title="Page Background"
                    />
                    <div className="mt-4">
                      <Input
                        label="Background Color or Image URL"
                        name="cardSkin"
                        placeholder="#F3F4F6 or https://..."
                        value={form.cardSkin}
                        onChange={handleChange}
                      />
                      <p className="text-[10px] text-slate-400 ml-1 mt-1">
                        Essential for "Glass" layout. Paste a HEX code or image
                        link.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-full lg:w-2/5">
          <div className="sticky top-28 flex flex-col items-center">
            <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Preview
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 border-[10px] border-slate-900 rounded-[3.5rem] pointer-events-none shadow-2xl z-10"></div>
              <div className="relative z-0 overflow-hidden rounded-[2.5rem]">
                <CardPreview data={form} />
              </div>
            </div>
            <p className="mt-8 text-slate-400 text-sm italic text-center max-w-[280px]">
              This is how your digital card will appear to others when shared.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all border-b-2 ${
        active
          ? "border-blue-600 text-blue-600 bg-white"
          : "border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-slate-800 font-bold">
      {icon} <span>{title}</span>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        {title}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 ml-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}
