import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Car
} from 'lucide-react';
import { Vehicle } from '../../types';
import { deleteVehicle, setVehicleStatus, toggleVehicleFeatured } from '../../firebase/service';

interface AdminInventoryProps {
  vehicles: Vehicle[];
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onRefresh: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  vehicles,
  onAddVehicle,
  onEditVehicle,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter items
  const filtered = vehicles.filter((v) => {
    const matchesSearch = 
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || v.vehicleCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = async (vehicleId: string, newStatus: 'available' | 'reserved' | 'sold') => {
    try {
      setActionLoading(true);
      await setVehicleStatus(vehicleId, newStatus);
      onRefresh();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (vehicleId: string, currentVal: boolean) => {
    try {
      setActionLoading(true);
      await toggleVehicleFeatured(vehicleId, !currentVal);
      onRefresh();
    } catch (err) {
      console.error("Toggle featured error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setActionLoading(true);
      await deleteVehicle(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Showroom Inventory Management</h2>
          <p className="text-xs text-slate-500">
            Total {vehicles.length} vehicles registered in PM Cars Ariyalur stock
          </p>
        </div>

        <button
          onClick={onAddVehicle}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, brand or model..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
          />
        </div>

        <div>
          <select
            value={statusFilter || 'all'}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold Out</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter || 'all'}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition"
          >
            <option value="all">All Categories</option>
            <option value="private">Private (Own Board)</option>
            <option value="commercial">Commercial (T-Board)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Category & Board</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.thumbnail || v.images?.[0]}
                          alt={v.title}
                          className="w-14 h-10 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block line-clamp-1">{v.title}</span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {v.year} • {v.fuelType} • {v.kilometers ? `${v.kilometers.toLocaleString('en-IN')} km` : '0 km'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Board */}
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-800 block">{v.vehicleCategory}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 inline-block mt-0.5">
                        {v.registrationType}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      {v.priceDisplay}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value as any)}
                        disabled={actionLoading}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          v.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : v.status === 'reserved'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold Out</option>
                      </select>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(v.id, !!v.featured)}
                        disabled={actionLoading}
                        className={`p-1.5 rounded-lg border transition ${
                          v.featured
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={v.featured ? 'Featured on Homepage' : 'Not Featured'}
                      >
                        <Star className={`w-4 h-4 ${v.featured ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditVehicle(v)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Edit Vehicle"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(v)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No vehicles found matching current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 text-slate-900 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-bold text-lg">Confirm Vehicle Deletion</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently remove <strong>{deleteTarget.title}</strong> from PM Cars inventory? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
