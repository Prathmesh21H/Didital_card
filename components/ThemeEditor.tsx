import { useState, useEffect } from 'react';
import { Upload, X, Palette } from 'lucide-react';

interface ThemeEditorProps {
  currentLogo?: string;
  currentPrimaryColor?: string;
  currentSecondaryColor?: string;
  onSave: (logoUrl: string, primaryColor: string, secondaryColor: string) => Promise<void>;
}

const colorOptions = [
  { name: 'Orange', value: 'orange', preview: 'bg-orange-500' },
  { name: 'Blue', value: 'blue', preview: 'bg-blue-600' },
  { name: 'Purple', value: 'purple', preview: 'bg-purple-600' },
  { name: 'Red', value: 'red', preview: 'bg-red-600' },
  { name: 'Green', value: 'green', preview: 'bg-green-600' },
  { name: 'Teal', value: 'teal', preview: 'bg-teal-600' },
  { name: 'Pink', value: 'pink', preview: 'bg-pink-600' },
  { name: 'Indigo', value: 'indigo', preview: 'bg-indigo-600' },
];

export default function ThemeEditor({ 
  currentLogo, 
  currentPrimaryColor = 'orange', 
  currentSecondaryColor = 'green', 
  onSave 
}: ThemeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [logoUrl, setLogoUrl] = useState(currentLogo || '');
  const [primaryColor, setPrimaryColor] = useState(currentPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(currentSecondaryColor);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(currentLogo || '');
  const [error, setError] = useState('');

  // Sync with props when they change
  useEffect(() => {
    setLogoUrl(currentLogo || '');
    setLogoPreview(currentLogo || '');
    setPrimaryColor(currentPrimaryColor);
    setSecondaryColor(currentSecondaryColor);
  }, [currentLogo, currentPrimaryColor, currentSecondaryColor]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Using your credentials: dmhr3fumd and my_unsigned_preset
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmhr3fumd';
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'my_unsigned_preset';
    
    formData.append('upload_preset', uploadPreset);

    console.log('Uploading to Cloudinary:', cloudName, uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Cloudinary upload failed:', errorData);
      throw new Error('Failed to upload image to Cloudinary: ' + errorData);
    }

    const data = await res.json();
    console.log('Cloudinary upload success:', data.secure_url);
    return data.secure_url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo file size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Upload to Cloudinary and get URL
      const uploadedUrl = await uploadToCloudinary(file);
      setLogoUrl(uploadedUrl);
      setLogoPreview(uploadedUrl);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (isUploading) {
      setError('Please wait for logo upload to complete');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      await onSave(logoUrl, primaryColor, secondaryColor);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      setError('Failed to save theme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to current values
    setLogoUrl(currentLogo || '');
    setLogoPreview(currentLogo || '');
    setPrimaryColor(currentPrimaryColor);
    setSecondaryColor(currentSecondaryColor);
    setError('');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Brand Theme
            </h3>
            <p className="text-sm text-gray-600 mt-1">Customize your profile&apos;s look</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Edit Theme
          </button>
        </div>

        <div className="space-y-4">
          {logoPreview && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Logo</p>
              <div className="w-32 h-20 bg-gray-50 border-2 border-gray-200 rounded-lg flex items-center justify-center p-2">
                <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Primary Color</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-${primaryColor}-500 border-2 border-gray-300`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">{primaryColor}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Secondary Color</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-${secondaryColor}-600 border-2 border-gray-300`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">{secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Customize Theme
          </h3>
          <p className="text-sm text-gray-600 mt-1">Upload logo and choose colors</p>
        </div>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo (Max 5MB)
          </label>
          <div className="flex items-start gap-4">
            {logoPreview && (
              <div className="w-32 h-20 bg-gray-50 border-2 border-gray-300 rounded-lg flex items-center justify-center p-2">
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload logo</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, SVG or JPG</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Logo will be uploaded to Cloudinary for optimized delivery
          </p>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Primary Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setPrimaryColor(color.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                  primaryColor === color.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${color.preview}`}></div>
                <span className="text-xs font-medium text-gray-700">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Secondary Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSecondaryColor(color.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                  secondaryColor === color.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${color.preview}`}></div>
                <span className="text-xs font-medium text-gray-700">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg bg-${primaryColor}-500 text-white text-sm font-medium`}>
              Primary
            </div>
            <div className={`px-4 py-2 rounded-lg bg-${secondaryColor}-600 text-white text-sm font-medium`}>
              Secondary
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : isUploading ? 'Uploading...' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  );
}