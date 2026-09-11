import React, { useState, useEffect } from 'react';
import { BusinessSettings } from '../../types';
import { saveBusinessSettings } from '../../firebase/service';
import { DEFAULT_BUSINESS_SETTINGS } from '../../data/initialData';
import { Save, CheckCircle2, AlertCircle, Building2, Phone, Clock, FileText, Globe } from 'lucide-react';

interface AdminSettingsProps {
  settings?: BusinessSettings;
  onSaved: (newSettings: BusinessSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaved
}) => {
  const [formData, setFormData] = useState<BusinessSettings>({
    ...DEFAULT_BUSINESS_SETTINGS,
    ...(settings || {})
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({
        ...DEFAULT_BUSINESS_SETTINGS,
        ...prev,
        ...settings
      }));
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await saveBusinessSettings(formData);
      setSuccess(true);
      onSaved(formData);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-6 max-w-4xl shadow-xs">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Dealership & Business Information</h3>
        <p className="text-xs text-slate-500">
          Configure physical showroom details, contact helplines, operational hours, and website headline copy.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Business settings updated and synchronized successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dealership Identity */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Showroom Identity & Location</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dealership Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address / Yard Location</label>
              <input
                type="text"
                name="locationAddress"
                value={formData.locationAddress ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Direct Helplines & WhatsApp</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone1"
                value={formData.phone1 ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary Phone</label>
              <input
                type="text"
                name="phone2"
                value={formData.phone2 ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number (10 digits)</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Showroom Operational Hours</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monday – Thursday</label>
              <input
                type="text"
                name="businessHoursWeekdays"
                value={formData.businessHoursWeekdays ?? ''}
                onChange={handleChange}
                placeholder="7:00 AM – 8:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Friday</label>
              <input
                type="text"
                name="businessHoursFriday"
                value={formData.businessHoursFriday ?? ''}
                onChange={handleChange}
                placeholder="7:00 AM – 8:30 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Saturday – Sunday</label>
              <input
                type="text"
                name="businessHoursWeekend"
                value={formData.businessHoursWeekend ?? ''}
                onChange={handleChange}
                placeholder="7:00 AM – 8:00 PM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Public Website Hero Messaging</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Main Hero Headline</label>
              <input
                type="text"
                name="heroHeadline"
                value={formData.heroHeadline ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Subheadline / Description</label>
              <textarea
                name="heroDescription"
                rows={2}
                value={formData.heroDescription ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Social Media Channels</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                name="facebookUrl"
                value={formData.facebookUrl ?? ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                name="instagramUrl"
                value={formData.instagramUrl ?? ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Business Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
