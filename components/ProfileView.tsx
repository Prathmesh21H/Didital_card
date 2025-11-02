// components/ProfileView.tsx
'use client';
import { useEffect, useState } from 'react';
import { Phone, Mail, Globe, Linkedin, Twitter, Instagram, Facebook, UserPlus, Share2, CheckCircle, MapPin, Building2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/AuthContext';

interface ProfileData {
  slug: string;
  fullName: string;
  designation?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  qrCodeUrl?: string;
}

interface ProfileViewProps {
  profile: ProfileData;
  userId: string;
}

export default function ProfileView({ profile, userId }: ProfileViewProps) {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const [showFullBio, setShowFullBio] = useState(false);
  
  const isOwner = user?.uid === userId;
  const bioLimit = 150;
  const shouldTruncate = profile.bio && profile.bio.length > bioLimit;

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const profileUrl = `${baseUrl}/${profile.slug}`;
        
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1a5e3a',
            light: '#FFFFFF',
          },
        });
        
        setQrCode(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setQrLoading(false);
      }
    };

    generateQRCode();
  }, [profile.slug]);

  const handleAddContact = async () => {
    try {
      const response = await fetch(`/api/vcard?userId=${userId}`);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `${profile.fullName}.vcf`, { type: 'text/vcard' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${profile.fullName}'s Contact`,
            files: [file]
          });
          
          setSaveStatus('success');
          setTimeout(() => setSaveStatus('idle'), 3000);
          return;
        }
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.fullName}.vcf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-700">Bharat</span>
              <span className="text-2xl font-bold text-orange-500 ml-1">Valley</span>
            </div>
          </div>
          {!isOwner && (
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${profile.fullName}'s Digital Card`,
                    text: `Connect with ${profile.fullName}`,
                    url: window.location.href
                  }).catch(err => console.log('Share cancelled', err));
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Top Section - Profile Info */}
          <div className="p-8 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                    {profile.fullName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name and Details */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {profile.fullName}
                </h1>
                
                {profile.designation && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-1">
                    <Briefcase className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-medium">{profile.designation}</span>
                  </div>
                )}
                
                {profile.company && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-4">
                    <Building2 className="w-4 h-4 text-green-600" />
                    <span className="text-base">{profile.company}</span>
                  </div>
                )}

                {/* Primary CTA */}
                <button
                  onClick={handleAddContact}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm ${
                    saveStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {saveStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Added Successfully!
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Add to Contacts
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="px-8 pb-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {shouldTruncate && !showFullBio
                    ? `${profile.bio.substring(0, bioLimit)}...`
                    : profile.bio}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium mt-3 transition-colors"
                  >
                    {showFullBio ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Read More</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="px-8 pb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <p className="text-gray-900 font-semibold truncate">{profile.phone}</p>
                  </div>
                </a>
              )}
              
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 font-semibold truncate">{profile.email}</p>
                  </div>
                </a>
              )}
              
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group md:col-span-2"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Globe className="w-5 h-5 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    <p className="text-gray-900 font-semibold truncate">{profile.website}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(profile.linkedin || profile.twitter || profile.instagram || profile.facebook) && (
            <div className="px-8 pb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Social Media
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 transition-all font-medium"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-pink-500 hover:bg-pink-50 hover:text-pink-700 transition-all font-medium"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
                
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all font-medium"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}

          {/* QR Code Section - Only visible to owner */}
          {isOwner && (
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 text-center">
                  Your QR Code
                </h3>
                <div className="flex justify-center">
                  {qrLoading ? (
                    <div className="w-48 h-48 flex items-center justify-center bg-white rounded-xl">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                  ) : qrCode ? (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-gray-400 bg-white rounded-xl">
                      Unable to generate QR code
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Share this QR code to let others connect with you instantly
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-green-700">Bharat</span><span className="font-semibold text-orange-500">Valley</span>
          </p>
        </div>
      </div>
    </div>
  );
}