import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types';
import { saveVehicle } from '../../firebase/service';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Car, 
  IndianRupee, 
  AlertCircle,
  FileText,
  ShieldCheck,
  Star
} from 'lucide-react';

interface AdminVehicleFormProps {
  initialVehicle?: Vehicle | null;
  onCancel: () => void;
  onSaved: () => void;
}

const DEFAULT_FORM: Partial<Vehicle> = {
  title: '',
  brand: '',
  model: '',
  variant: '',
  vehicleCategory: 'private',
  registrationType: 'Own Board',
  bodyType: 'Hatchback',
  price: 350000,
  priceDisplay: '₹3,50,000',
  negotiable: true,
  year: new Date().getFullYear(),
  kilometers: 45000,
  owners: 1,
  fuelType: 'Petrol',
  transmission: 'Manual',
  color: 'White',
  condition: 'Clean chassis, well maintained, no major accidental history.',
  serviceHistory: 'Periodic service records verified.',
  insuranceStatus: 'Comprehensive Live Insurance',
  insuranceExpiry: 'Dec 2026',
  features: ['Power Steering', 'Air Conditioning', 'Central Locking', 'Power Windows'],
  description: 'Direct owner vehicle inspected and parked at PM Cars yard. Excellent running condition.',
  thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  images: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  ],
  status: 'available',
  featured: false
};

export const AdminVehicleForm: React.FC<AdminVehicleFormProps> = ({
  initialVehicle,
  onCancel,
  onSaved
}) => {
  const isEdit = !!initialVehicle;

  const [formData, setFormData] = useState<Partial<Vehicle>>({ ...DEFAULT_FORM });
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialVehicle) {
      setFormData({
        ...DEFAULT_FORM,
        ...initialVehicle,
        title: initialVehicle.title ?? '',
        brand: initialVehicle.brand ?? '',
        model: initialVehicle.model ?? '',
        variant: initialVehicle.variant ?? '',
        vehicleCategory: initialVehicle.vehicleCategory ?? 'private',
        registrationType: initialVehicle.registrationType ?? 'Own Board',
        bodyType: initialVehicle.bodyType ?? 'Hatchback',
        price: initialVehicle.price ?? 0,
        priceDisplay: initialVehicle.priceDisplay ?? '',
        negotiable: initialVehicle.negotiable ?? true,
        year: initialVehicle.year ?? new Date().getFullYear(),
        kilometers: initialVehicle.kilometers ?? 0,
        owners: initialVehicle.owners ?? 1,
        fuelType: initialVehicle.fuelType ?? 'Petrol',
        transmission: initialVehicle.transmission ?? 'Manual',
        color: initialVehicle.color ?? '',
        condition: initialVehicle.condition ?? '',
        serviceHistory: initialVehicle.serviceHistory ?? '',
        insuranceStatus: initialVehicle.insuranceStatus ?? '',
        insuranceExpiry: initialVehicle.insuranceExpiry ?? '',
        features: initialVehicle.features ?? [],
        description: initialVehicle.description ?? '',
        thumbnail: initialVehicle.thumbnail ?? '',
        images: initialVehicle.images ?? [],
        status: initialVehicle.status ?? 'available',
        featured: initialVehicle.featured ?? false,
      });
    } else {
      setFormData({ ...DEFAULT_FORM });
    }
  }, [initialVehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      const numVal = Number(value) || 0;
      setFormData((prev) => ({
        ...prev,
        price: numVal,
        priceDisplay: `₹${numVal.toLocaleString('en-IN')}`
      }));
    } else if (name === 'year' || name === 'kilometers' || name === 'owners') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    const current = formData.features || [];
    if (!current.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...current, newFeature.trim()] });
    }
    setNewFeature('');
  };

  const removeFeature = (feat: string) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((f) => f !== feat)
    });
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    const current = formData.images || [];
    const updated = [...current, newImageUrl.trim()];
    setFormData({
      ...formData,
      images: updated,
      thumbnail: formData.thumbnail || newImageUrl.trim()
    });
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    const updated = (formData.images || []).filter((_, idx) => idx !== index);
    setFormData({
      ...formData,
      images: updated,
      thumbnail: updated[0] || ''
    });
  };

  const setAsThumbnail = (url: string) => {
    setFormData({ ...formData, thumbnail: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaving(true);

    try {
      if (!formData.title?.trim()) throw new Error('Vehicle title is required.');
      if (!formData.brand?.trim()) throw new Error('Brand is required.');
      if (!formData.model?.trim()) throw new Error('Model is required.');
      if (!formData.price || formData.price <= 0) throw new Error('Please specify a valid price.');

      const vehicleToSave: Partial<Vehicle> = {
        ...formData,
        thumbnail: formData.thumbnail || formData.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        images: formData.images && formData.images.length > 0 ? formData.images : [formData.thumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'],
      };

      if (isEdit && initialVehicle?.id) {
        await saveVehicle({ ...vehicleToSave, id: initialVehicle.id });
      } else {
        await saveVehicle(vehicleToSave as Omit<Vehicle, 'id'>);
      }

      onSaved();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save vehicle.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-900 space-y-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEdit ? 'Edit Vehicle Inventory Details' : 'Add New Vehicle to Showroom Yard'}
            </h2>
            <p className="text-xs text-slate-500">
              Fill out vehicle specifications, pricing, registration type, and high-resolution images.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Vehicle'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section A: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <Car className="w-4 h-4" />
            <span>Section A: Basic Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Title / Listing Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title ?? ''}
                onChange={handleChange}
                placeholder="e.g. Maruti Suzuki Swift Dzire VDI"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand / Manufacturer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand ?? ''}
                onChange={handleChange}
                placeholder="e.g. Maruti, Hyundai, Tata"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                required
                value={formData.model ?? ''}
                onChange={handleChange}
                placeholder="e.g. Swift, Innova, Dost"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Variant</label>
              <input
                type="text"
                name="variant"
                value={formData.variant ?? ''}
                onChange={handleChange}
                placeholder="e.g. VDI ABS / SX (O)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vehicle Category <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleCategory"
                value={formData.vehicleCategory ?? 'private'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
              >
                <option value="private">Private (Passenger / Family Car)</option>
                <option value="commercial">Commercial (T-Board / Load Carrier)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Board Type
              </label>
              <select
                name="registrationType"
                value={formData.registrationType ?? 'Own Board'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
              >
                <option value="Own Board">Own Board (White Number Plate)</option>
                <option value="T-Board">T-Board (Yellow Number Plate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Availability Status
              </label>
              <select
                name="status"
                value={formData.status ?? 'available'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
              >
                <option value="available">Available (In Showroom)</option>
                <option value="reserved">Reserved (Token Received)</option>
                <option value="sold">Sold Out</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Pricing */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            <span>Section B: Pricing & Highlight Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (Numeric ₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price ?? 0}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Formatted Price
              </label>
              <input
                type="text"
                name="priceDisplay"
                value={formData.priceDisplay ?? ''}
                onChange={handleChange}
                placeholder="e.g. ₹4,25,000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable ?? true}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span>Negotiable Price</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-amber-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured ?? false}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Mark as Featured</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section C: Vehicle Details */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Section C: Technical Specifications</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Model Year</label>
              <input
                type="number"
                name="year"
                value={formData.year ?? new Date().getFullYear()}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kilometers Driven</label>
              <input
                type="number"
                name="kilometers"
                value={formData.kilometers ?? 0}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ownership</label>
              <select
                name="owners"
                value={formData.owners ?? 1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
              >
                <option value={1}>1st Owner</option>
                <option value={2}>2nd Owner</option>
                <option value={3}>3rd Owner</option>
                <option value={4}>4th+ Owner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType ?? 'Petrol'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission ?? 'Manual'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exterior Color</label>
              <input
                type="text"
                name="color"
                value={formData.color ?? ''}
                onChange={handleChange}
                placeholder="e.g. White"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section D: Condition & Verification */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Section D: Condition & Verification Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Condition Remarks</label>
              <input
                type="text"
                name="condition"
                value={formData.condition ?? ''}
                onChange={handleChange}
                placeholder="Engine, tyres, body condition..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service History</label>
              <input
                type="text"
                name="serviceHistory"
                value={formData.serviceHistory ?? ''}
                onChange={handleChange}
                placeholder="Periodic service records status..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Status</label>
              <input
                type="text"
                name="insuranceStatus"
                value={formData.insuranceStatus ?? ''}
                onChange={handleChange}
                placeholder="e.g. Live Comprehensive Insurance / Third Party"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Expiry Date</label>
              <input
                type="text"
                name="insuranceExpiry"
                value={formData.insuranceExpiry ?? ''}
                onChange={handleChange}
                placeholder="e.g. October 2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section E: Dynamic Features List */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700">
            Section E: Key Features & Equipment
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); }}}
              placeholder="e.g. Touchscreen Infotainment, Reverse Camera, Alloy Wheels"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Feature</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(formData.features || []).map((feat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs flex items-center gap-2 border border-slate-200"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(feat)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer font-bold"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section F: Description */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700">
            Section F: Detailed Dealership Notes / Description
          </h3>
          <textarea
            name="description"
            rows={4}
            value={formData.description ?? ''}
            onChange={handleChange}
            placeholder="Comprehensive description for buyers..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
          />
        </div>

        {/* Section G: Image Gallery Management */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Section G: Vehicle Photography & Gallery</span>
          </h3>

          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste direct image URL (https://...)"
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 border border-slate-200 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Image</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-3">
            {(formData.images || []).map((img, idx) => (
              <div
                key={idx}
                className={`relative group rounded-xl overflow-hidden border-2 bg-slate-100 aspect-video ${
                  formData.thumbnail === img ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                }`}
              >
                <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                  <button
                    type="button"
                    onClick={() => setAsThumbnail(img)}
                    className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded self-start cursor-pointer"
                  >
                    {formData.thumbnail === img ? 'Primary' : 'Set Primary'}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 bg-red-600 text-white rounded self-end hover:bg-red-500 cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {formData.thumbnail === img && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                    THUMBNAIL
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xs cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEdit ? 'Save Vehicle Changes' : 'Publish Vehicle'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
