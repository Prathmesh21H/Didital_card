"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { cardAPI, setAuthToken, subscriptionAPI } from "@/lib/api";
import { CardPreview } from "@/components/CardPreview";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertTriangle,
  User,
  Palette,
  Trash2,
  Lock,
  Type,
  ImageIcon,
  Upload,
  X,
  Share2,
  Link as LinkIcon,
  Crown,
} from "lucide-react";

// --- CONSTANTS ---
const PLANS = {
  FREE: "FREE",
  PRO: "PRO",
};

// --- Layout Definitions ---
const layoutOptions = [
  { id: "minimal", isPro: false },
  { id: "modern", isPro: false },
  { id: "creative", isPro: false },
  { id: "corporate", isPro: true },
  { id: "glass", isPro: true },
  { id: "elegant", isPro: true },
];

// --- Skin Patterns ---
const skinPatterns = [
  { name: "None", url: "" },
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

export default function EditCardPage() {
  const { cardId } = useParams();
  const router = useRouter();

  // --- STATE ---
  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    company: "",
    bio: "",
    profileUrl: "",
    banner: { type: "color", value: "#2563eb" },
    accentColor: "#2563eb",
    cardSkin: "",
    layout: "minimal",
    fontStyle: "basic",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
   
  // Subscription State
  const [subscription, setSubscription] = useState(null);

  // Image Upload State
  const [pendingImage, setPendingImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // --- CONFIG ---
  const CLOUDINARY_UPLOAD_PRESET = "DigitalCard";
  const CLOUDINARY_CLOUD_NAME = "dmow3iq7c";

  // --- FONTS ---
  const fontOptions = [
    { id: "basic", label: "Basic", class: "font-sans" },
    { id: "serif", label: "Serif", class: "font-serif" },
    { id: "mono", label: "Mono", class: "font-mono" },
    { id: "script", label: "Script", class: "font-serif italic" },
    { id: "wide", label: "Wide", class: "font-sans tracking-widest uppercase text-[10px]" },
    { id: "bold", label: "Bold", class: "font-sans font-black" },
  ];

  // --- LOGIC: Determine Pro Status ---
  const isPro = subscription?.plan?.toUpperCase() === PLANS.PRO;

  // --- INITIAL LOAD ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setAuthToken(token);
        await Promise.all([loadCard(), fetchSubscription()]);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [cardId]);

  async function fetchSubscription() {
    try {
      const res = await subscriptionAPI.getCurrentSubscription();
      setSubscription(res);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
      setSubscription({ plan: PLANS.FREE });
    }
  }

  async function loadCard() {
    try {
      const data = await cardAPI.getCardById(cardId);
      setForm({
        ...data,
        banner: data.banner || { type: "color", value: "#2563eb" },
        accentColor: data.accentColor || "#2563eb",
        layout: data.layout || "minimal",
        fontStyle: data.fontStyle || "basic",
      });
    } catch (err) {
      console.error(err);
      setError("We couldn't find this card or you don't have permission to edit it.");
    } finally {
      setLoading(false);
    }
  }

  // --- VALIDATION ---
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full Name is required";
        if (value.trim().length < 2) return "Min 2 characters required";
        break;
      case "email":
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          return "Invalid email format";
        break;
      case "phone":
        if (value && !/^\+?[\d\s-]{7,15}$/.test(value))
          return "Invalid phone number";
        break;
      case "website":
        if (value && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value))
          return "Invalid website URL";
        break;
      case "bio":
        if (value.trim().length > 200)
          return "Bio must not exceed 200 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) errors[key] = error;
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- HANDLERS ---
  const handleLockedFeature = () => {
    if (!isPro) {
      if (confirm("This is a Pro feature. Upgrade to unlock?")) {
        router.push("/subscription");
      }
      return true; // Blocked
    }
    return false; // Allowed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const updateBanner = (type, value) => {
    if (type === "image" && handleLockedFeature()) return;
    setForm({ ...form, banner: { type, value } });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB.");
      return;
    }
    const localPreviewUrl = URL.createObjectURL(file);
    setPendingImage(file);
    setForm((prev) => ({ ...prev, profileUrl: localPreviewUrl }));
    setError("");
  };

  const removeImage = () => {
    setPendingImage(null);
    setForm((prev) => ({ ...prev, profileUrl: "" }));
  };

  const handleLayoutSelect = (layoutId, layoutIsPro) => {
    if (layoutIsPro && handleLockedFeature()) return;
    setForm({ ...form, layout: layoutId });
  };

  // --- ACTIONS ---
  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      if (!validateForm()) throw new Error("Please fix the errors in the form.");

      const selectedLayoutObj = layoutOptions.find((l) => l.id === form.layout);
      if (selectedLayoutObj?.isPro && !isPro) {
        throw new Error("You are using a Pro layout. Please upgrade to save changes.");
      }

      let finalProfileUrl = form.profileUrl;
      if (pendingImage && form.profileUrl.startsWith("blob:")) {
        const formData = new FormData();
        formData.append("file", pendingImage);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        finalProfileUrl = res.data.secure_url;
      }

      const payload = { ...form, profileUrl: finalProfileUrl };
      await cardAPI.updateCard(cardId, payload);
      router.push("/dashboard");
    } catch (err) {
      console.error("Save Error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save changes.";
      setError(msg);
      if (msg.includes("fix the errors")) setActiveTab("content");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await cardAPI.deleteCard(cardId);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to delete card.");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-red-600 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Delete Card?</h3>
            <p className="text-slate-500 mb-8 text-center">This action cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold"
              >
                {deleting ? "Deleting..." : "Yes, Delete Card"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
          >
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
             {/* Plan Badge */}
             <div className={`hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${isPro ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                {isPro ? <Crown size={14} /> : null}
                {isPro ? "Pro Plan" : "Free Plan"}
             </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}{" "}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col lg:flex-row gap-10">
        {/* Editor */}
        <div className="w-full lg:w-3/5 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-fit">
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

          <div className="p-8 lg:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {activeTab === "content" ? (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Identity Section */}
                <FormSection title="Identity">
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
                          <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600">
                            <Upload className="mb-2" size={24} />
                            <span className="text-xs font-semibold">
                              Click to change image
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
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
                    error={formErrors.fullName}
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

                {/* Bio Section */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase ml-1 mb-1">
                    About
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full rounded-2xl border p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all ${
                      formErrors.bio ? "border-red-500" : "border-slate-200"
                    }`}
                    placeholder="Tell people who you are..."
                  />
                  {formErrors.bio && (
                    <p className="text-red-500 text-xs ml-1 mt-1">{formErrors.bio}</p>
                  )}
                </div>

                {/* Contact Section */}
                <FormSection title="Contact Info">
                  <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={formErrors.phone} />
                  <Input label="Email" name="email" value={form.email} onChange={handleChange} error={formErrors.email} />
                  <Input label="Website" name="website" value={form.website} onChange={handleChange} error={formErrors.website} />
                </FormSection>

                {/* Social Media Section */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase ml-1 mb-3 flex items-center gap-2">
                    <Share2 size={12} /> Social Media Links
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                    <Input label="Twitter (X) URL" name="twitter" value={form.twitter} onChange={handleChange} placeholder="@username or url" />
                    <Input label="Instagram URL" name="instagram" value={form.instagram} onChange={handleChange} placeholder="@username or url" />
                    <Input label="Facebook URL" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in duration-300">
                {/* LAYOUT SELECTOR */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading icon={<Type size={18} />} title="Choose Layout" />
                    {!isPro && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Crown size={12} /> Go Pro to Unlock All
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {layoutOptions.map((layout) => {
                      const isLocked = layout.isPro && !isPro;

                      return (
                        <button
                          key={layout.id}
                          onClick={() => handleLayoutSelect(layout.id, layout.isPro)}
                          className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group cursor-pointer ${
                            form.layout === layout.id
                              ? "border-blue-600 bg-blue-50/50"
                              : "border-slate-100 bg-white"
                          } ${
                            isLocked
                              ? "hover:ring-2 hover:ring-amber-400 hover:border-amber-400"
                              : "hover:border-blue-200"
                          }`}
                        >
                          {/* LOCKED OVERLAY */}
                          {isLocked && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-[1px] rounded-2xl transition-opacity group-hover:bg-slate-50/40">
                              <div className="bg-slate-900 text-white p-2 rounded-full shadow-lg group-hover:bg-amber-500 transition-colors">
                                <Lock size={16} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-900 mt-1 bg-white/80 px-2 rounded-full">
                                Pro
                              </span>
                            </div>
                          )}

                          {/* Mini Preview Placeholder */}
                          <div className="w-full aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative shadow-sm border border-slate-200/50">
                            {layout.id === "minimal" && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-50">
                                <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                                <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
                              </div>
                            )}
                            {layout.id === "modern" && (
                              <div className="absolute inset-0 flex flex-col p-2 gap-2 opacity-50">
                                <div className="w-full h-6 bg-slate-300 rounded-t-lg mb-[-10px]"></div>
                                <div className="w-8 h-8 rounded-lg bg-slate-400 border-2 border-white z-10 ml-1"></div>
                              </div>
                            )}
                            {layout.id === "creative" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-400 shadow-sm"></div>
                                </div>
                              </div>
                            )}
                            {layout.id === "corporate" && (
                              <div className="absolute inset-0 flex opacity-60">
                                <div className="w-1/3 h-full bg-slate-600 flex flex-col items-center pt-2 gap-1">
                                  <div className="w-5 h-5 rounded-full bg-white/50"></div>
                                </div>
                                <div className="w-2/3 bg-white"></div>
                              </div>
                            )}
                            {layout.id === "glass" && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-60 bg-gradient-to-br from-blue-200 to-purple-200">
                                <div className="w-16 h-10 bg-white/50 backdrop-blur-sm rounded border border-white/60"></div>
                              </div>
                            )}
                            {layout.id === "elegant" && (
                              <div className="absolute inset-0 p-2 flex flex-col items-center justify-center opacity-50">
                                <div className="w-full h-full border border-slate-500 flex items-center justify-center">
                                  <div className="w-6 h-6 rotate-45 border border-slate-500"></div>
                                </div>
                              </div>
                            )}
                          </div>

                          <span className="text-xs font-bold capitalize text-slate-600">
                            {layout.id}
                          </span>
                          {form.layout === layout.id && (
                            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Banner Colors */}
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
                      className={`relative px-4 py-2 text-xs font-bold rounded-lg border flex items-center gap-2 ${
                        form.banner.type === "image"
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white border-slate-200 text-slate-600"
                      } ${!isPro ? "opacity-70" : ""}`}
                    >
                      Image
                      {!isPro && <Lock size={12} className="text-amber-600" />}
                    </button>
                  </div>

                  {form.banner.type === "color" ? (
                    <div className="flex flex-wrap gap-3">
                      {[
                        "#2563eb", "#7C3AED", "#DB2777", "#059669",
                        "#DC2626", "#0F172A", "#F59E0B",
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
                      placeholder="https://..."
                      value={form.banner.value}
                      onChange={(e) => updateBanner("image", e.target.value)}
                      disabled={!isPro}
                    />
                  )}
                  
                  {/* Accent Color */}
                  {/* <div className="mt-6 relative">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase">Accent Color</label>
                        {!isPro && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 rounded-full flex items-center gap-1"><Crown size={10} /> PRO</span>}
                      </div>
                      <div className="flex items-center gap-3" onClickCapture={() => !isPro && handleLockedFeature()}>
                          <div className="relative">
                            <input 
                                type="color" 
                                value={form.accentColor}
                                onChange={(e) => setForm({...form, accentColor: e.target.value})}
                                disabled={!isPro}
                                className={`w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden ${!isPro ? "opacity-50" : ""}`}
                            />
                          </div>
                          <input 
                            type="text"
                            value={form.accentColor}
                            onChange={(e) => setForm({...form, accentColor: e.target.value})}
                            disabled={!isPro}
                            className={`flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none uppercase ${!isPro ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
                          />
                      </div>
                  </div> */}
                </div>

                {/* Typography */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase ml-1 mb-2">
                    Typography
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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

                {/* Card Skin Section (Updated) */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading icon={<ImageIcon size={18} />} title="Page Background" />
                    {!isPro && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Crown size={12} /> Pro
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Skins Grid */}
                    <div 
                      className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                      onClickCapture={() => !isPro && handleLockedFeature()} // Locks the whole grid
                    >
                      {skinPatterns.map((skin, idx) => {
                        const isActive = form.cardSkin === skin.url || (!form.cardSkin && !skin.url);
                        
                        return (
                          <div
                            key={idx}
                            onClick={() => setForm({ ...form, cardSkin: skin.url })}
                            className={`aspect-square rounded-xl border-2 cursor-pointer overflow-hidden relative transition-all group ${
                              isActive
                                ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                                : "border-slate-200 hover:border-slate-300"
                            } ${!isPro ? "opacity-60" : ""}`}
                          >
                            {skin.url ? (
                              <img
                                src={skin.url}
                                alt={skin.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium">
                                None
                              </div>
                            )}
                            
                            {/* Label Overlay */}
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-1 text-center backdrop-blur-sm">
                              <span className="text-[10px] text-white font-medium uppercase tracking-wide">
                                {skin.name}
                              </span>
                            </div>

                            {/* Lock Icon Overlay */}
                            {!isPro && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="bg-slate-900/80 p-1.5 rounded-full text-white shadow-sm">
                                  <Lock size={12} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom URL Input */}
                    <div onClickCapture={() => !isPro && handleLockedFeature()}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                        Or use custom URL / Hex Color
                      </label>
                      <Input
                        placeholder="#F3F4F6 or https://..."
                        value={form.cardSkin || ""}
                        onChange={(e) => setForm({ ...form, cardSkin: e.target.value })}
                        disabled={!isPro}
                        className={!isPro ? "bg-slate-50 cursor-not-allowed" : ""}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 text-red-600 text-xs font-bold hover:underline"
                  >
                    <Trash2 size={14} /> Delete Card
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-2/5 flex flex-col items-center">
          <div className="sticky top-28">
            <CardPreview data={form} />
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
      className={`flex-1 py-5 text-sm font-bold flex justify-center gap-2 transition-all ${
        active
          ? "border-b-2 border-blue-600 text-blue-600 bg-white"
          : "text-slate-400 hover:text-slate-600"
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

function Input({ label, error, className, ...props }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-[11px] font-black text-slate-500 ml-1 uppercase mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-2xl border px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 ${
          error ? "border-red-500" : "border-slate-200"
        } ${className || ""}`}
      />
      {error && <p className="text-red-500 text-xs ml-1 mt-1">{error}</p>}
    </div>
  );
}