import React, { useState, useEffect } from "react";
import {
  Share2,
  Zap,
  Menu,
  X,
  User,
  CreditCard,
  LogOut,
  Download,
  Phone,
  Mail,
  Edit,
  Loader2,
  ChevronRight,
  Check,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Building2,
  Link2,
  Camera,
} from "lucide-react";
import getBannerStyle from "./constants";

const BANNER_IMAGE_URL =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";

const ProfileModal = ({ isOpen, onClose, user, onSaveSuccess }) => {
  const [step, setStep] = useState(1); // 1: Necessary, 2: Optional
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    designation: "",
    company: "",
    profileUrl: "",
    bio: "",
    phone: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  // Reset or pre-fill on open
  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({ ...prev, ...user }));
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onSaveSuccess(result.user || formData);
        onClose();
      } else {
        alert("Failed to create profile. Please try again.");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-3xl flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">
        {/* Left Side: Banner */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-end p-10"
          style={{ backgroundImage: `url('${BANNER_IMAGE_URL}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-2 mb-4 text-blue-200">
              <Sparkles size={24} />
              <span className="text-sm font-bold uppercase tracking-wider">
                Welcome
              </span>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Let's get <br /> you setup.
            </h2>
            <p className="text-slate-200 text-lg font-medium">
              Create your profile to start building your digital presence.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 relative flex flex-col bg-white">
          <div className="p-8 pb-4 flex justify-between items-center relative z-10">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                {step === 1 ? "Essential Details" : "Additional Info"}
              </h3>
              <p className="text-sm text-slate-500">Step {step} of 2</p>
            </div>
            {user && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-800 p-2 bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="px-8 w-full">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500 ease-out"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-6">
            {step === 1 ? (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Profile Photo URL
                  </label>
                  <div className="relative">
                    <Camera
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="profileUrl"
                      value={formData.profileUrl}
                      onChange={handleChange}
                      placeholder="https://your-image-url.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Designation
                    </label>
                    <div className="relative">
                      <Briefcase
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Developer"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Company
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">
                      Website
                    </label>
                    <div className="relative">
                      <Link2
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="site.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2 mt-2">
                    Social Profiles
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Linkedin
                        size={16}
                        className="absolute left-3 top-3 text-blue-700"
                      />
                      <input
                        type="text"
                        name="linkedin"
                        placeholder="LinkedIn"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="relative">
                      <Twitter
                        size={16}
                        className="absolute left-3 top-3 text-sky-500"
                      />
                      <input
                        type="text"
                        name="twitter"
                        placeholder="Twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="relative">
                      <Instagram
                        size={16}
                        className="absolute left-3 top-3 text-pink-600"
                      />
                      <input
                        type="text"
                        name="instagram"
                        placeholder="Instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="relative">
                      <Facebook
                        size={16}
                        className="absolute left-3 top-3 text-blue-600"
                      />
                      <input
                        type="text"
                        name="facebook"
                        placeholder="Facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 pt-0 mt-auto flex justify-between items-center">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 font-semibold text-sm flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            <div
              className={`flex gap-3 ${step === 1 ? "w-full justify-end" : ""}`}
            >
              {step === 2 && (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={() => {
                  if (step === 1) {
                    if (!formData.fullName || !formData.email)
                      return alert("Name and Email are required");
                    setStep(2);
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : step === 1 ? (
                  <>
                    Next <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    Complete <Check size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;
