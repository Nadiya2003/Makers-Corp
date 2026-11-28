'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Car,
  Truck,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  Ship
} from 'lucide-react';

interface VehicleItem {
  _id?: string;
  id?: string;
  stockId: string;
  name: string;
  make: string;
  model: string;
  modelCode?: string;
  year: number;
  category: string;
  vehicleType?: string;
  bodyType?: string;
  fuel?: string;
  transmission?: string;
  mileageKm?: number;
  mileage?: string;
  priceUSD?: number;
  price?: string;
  priceFOB?: string;
  fobPort?: string;
  conditionGrade?: string;
  inspectionStatus?: string;
  image?: string;
  images?: string[];
  status?: string;
  availability?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  slug?: string;
  createdAt?: string;
}

export default function VehiclesManagementPage() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Vehicles' | 'Commercial Vehicles'>('All');
  const [makeFilter, setMakeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'year_desc'>('newest');

  // Deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/vehicles`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVehicles(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Distinct Makes for filter
  const makesList = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.make) set.add(v.make);
    });
    return ['All', ...Array.from(set).sort()];
  }, [vehicles]);

  // Filtered & Sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = v.name?.toLowerCase().includes(q);
          const matchStock = v.stockId?.toLowerCase().includes(q);
          const matchMake = v.make?.toLowerCase().includes(q);
          const matchModel = v.model?.toLowerCase().includes(q);
          const matchCode = v.modelCode?.toLowerCase().includes(q);
          if (!matchName && !matchStock && !matchMake && !matchModel && !matchCode) return false;
        }

        // Vehicle Type filter
        if (typeFilter !== 'All') {
          const isComm =
            v.vehicleType === 'Commercial Vehicles' ||
            v.bodyType?.includes('Commercial') ||
            v.bodyType?.includes('Truck');
          if (typeFilter === 'Commercial Vehicles' && !isComm) return false;
          if (typeFilter === 'Vehicles' && isComm) return false;
        }

        // Make filter
        if (makeFilter !== 'All' && v.make !== makeFilter) return false;

        // Status filter
        if (statusFilter !== 'All') {
          const vStatus = v.availability || v.status || 'Available';
          if (statusFilter === 'Available' && !vStatus.includes('Available')) return false;
          if (statusFilter === 'Reserved' && !vStatus.includes('Reserved')) return false;
          if (statusFilter === 'Sold' && !vStatus.includes('Sold')) return false;
          if (statusFilter === 'Draft' && v.isPublished !== false) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'year_desc') {
          return (b.year || 0) - (a.year || 0);
        }
        if (sortBy === 'price_asc') {
          return (a.priceUSD || 0) - (b.priceUSD || 0);
        }
        if (sortBy === 'price_desc') {
          return (b.priceUSD || 0) - (a.priceUSD || 0);
        }
        return 0;
      });
  }, [vehicles, searchTerm, typeFilter, makeFilter, statusFilter, sortBy]);

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const res = await fetch(`${apiUrl}/vehicles/${deleteId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setVehicles((prev) => prev.filter((v) => (v._id || v.id) !== deleteId));
        setActionMessage({ type: 'success', text: 'Vehicle record deleted successfully.' });
      } else {
        setActionMessage({ type: 'error', text: data.message || 'Delete failed.' });
      }
    } catch {
      setActionMessage({ type: 'error', text: 'Network error deleting vehicle.' });
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setTimeout(() => setActionMessage(null), 3500);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff6a00] rounded-sm" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
              MAKERS CORP JAPAN · INVENTORY DESK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-none mt-1">
            Vehicle Inventory Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage genuine Tokyo, Yokohama, Kobe & Nagoya yard stock. Add, edit, or archive vehicle listings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchVehicles}
            className="p-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors"
            title="Refresh inventory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/admin/vehicles/new"
            className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{actionMessage.text}</span>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, model, or Stock ID..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#ff6a00] focus:bg-white"
            />
          </div>

          {/* Type Selector (Vehicles vs Commercial) */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-[#ff6a00]"
            >
              <option value="All">All Types</option>
              <option value="Vehicles">Passenger Cars</option>
              <option value="Commercial Vehicles">Commercial Trucks</option>
            </select>
          </div>

          {/* Make Selector */}
          <div className="lg:col-span-2">
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
            >
              {makesList.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Makes' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#ff6a00]"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available (In Yard)</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          {/* Sort & View Mode Toggle */}
          <div className="lg:col-span-2 flex items-center justify-between gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none focus:border-[#ff6a00]"
            >
              <option value="newest">Sort: Newest</option>
              <option value="year_desc">Year: High-Low</option>
              <option value="price_asc">Price: Low-High</option>
              <option value="price_desc">Price: High-Low</option>
            </select>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#ff6a00]' : 'text-neutral-500'}`}
                title="Compact Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow-xs text-[#ff6a00]' : 'text-neutral-500'}`}
                title="Data Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Count summary */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing <strong className="text-neutral-900 font-bold">{filteredVehicles.length}</strong> of{' '}
            <strong className="text-neutral-900 font-bold">{vehicles.length}</strong> total vehicle records
          </span>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('All');
                setMakeFilter('All');
                setStatusFilter('All');
              }}
              className="text-[#ff6a00] hover:underline font-semibold text-[11px]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Inventory Display */}
      {loading ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mx-auto mb-3" />
          <span className="text-xs font-bold text-neutral-600">Loading Japanese vehicle inventory...</span>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-xs">
          <Car className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-neutral-900">No Vehicles Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            No vehicle records match your selected criteria. Try adjusting the search or filters.
          </p>
          <div className="mt-4">
            <Link
              href="/admin/vehicles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff6a00] hover:bg-[#e55f00] text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* =========================================================================
           COMPACT VEHICLE GRID (High Density, Micro-Padded, Clean Modern Layout)
           ========================================================================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {filteredVehicles.map((v) => {
            const vehicleId = v._id || v.id;
            const isSold = v.availability?.includes('Sold') || v.status === 'Sold';
            const isReserved = v.availability?.includes('Reserved') || v.status === 'Reserved';
            const coverImage = v.images?.[0] || v.image || '/images/vehicle.jpg';

            return (
              <div
                key={vehicleId}
                className="group bg-white border border-neutral-200 hover:border-[#ff6a00] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Compact Thumbnail Container */}
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <Image
                      src={coverImage}
                      alt={v.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Stock ID Plaque */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-1.5 py-0.5 bg-black/85 text-white font-mono text-[9px] font-bold rounded">
                        {v.stockId}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      {isSold ? (
                        <span className="px-1.5 py-0.5 bg-neutral-800 text-white text-[9px] font-black rounded uppercase">
                          Sold
                        </span>
                      ) : isReserved ? (
                        <span className="px-1.5 py-0.5 bg-amber-600 text-white text-[9px] font-black rounded uppercase">
                          Reserved
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-emerald-700 text-white text-[9px] font-bold rounded uppercase">
                          In Yard
                        </span>
                      )}
                    </div>

                    {v.isFeatured && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="px-1.5 py-0.5 bg-[#ff6a00] text-white text-[9px] font-black rounded uppercase flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Compact Content */}
                  <div className="p-3">
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-semibold mb-0.5 uppercase">
                      <span>{v.year}</span>
                      <span>·</span>
                      <span className="text-[#ff6a00] font-bold">{v.make}</span>
                      <span>·</span>
                      <span className="truncate">{v.category || v.bodyType || 'SUV'}</span>
                    </div>

                    <h3
                      className="font-black text-xs text-neutral-900 group-hover:text-[#ff6a00] transition-colors leading-snug line-clamp-1"
                      title={v.name}
                    >
                      {v.name}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1.5 pt-1.5 border-t border-neutral-100">
                      <span className="font-mono text-[10px]">
                        {v.mileageKm ? `${Number(v.mileageKm).toLocaleString()} km` : v.mileage || '—'}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {v.conditionGrade?.replace('Grade ', '') || 'S/A'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-sm font-black text-neutral-950">
                        USD {Number(v.priceUSD || 0).toLocaleString()}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-mono">
                        {v.fobPort?.replace('FOB ', '') || 'Yokohama'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compact Action Footer */}
                <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-1">
                  {v.slug ? (
                    <a
                      href={`/vehicles/${v.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : <div />}

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/vehicles/${vehicleId}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#fff4eb] text-neutral-700 hover:text-[#ff6a00] border border-neutral-200 hover:border-[#ffd1ad] rounded text-[11px] font-bold transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteId(vehicleId || '')}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================================================
           DATA TABLE VIEW (High Information Density for Large Fleet Inventories)
           ========================================================================= */
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-3">Stock ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Mileage</th>
                  <th className="py-3 px-3">Price (FOB)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredVehicles.map((v) => {
                  const vehicleId = v._id || v.id;
                  const coverImage = v.images?.[0] || v.image || '/images/vehicle.jpg';
                  const isSold = v.availability?.includes('Sold') || v.status === 'Sold';
                  const isReserved = v.availability?.includes('Reserved') || v.status === 'Reserved';

                  return (
                    <tr key={vehicleId} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Vehicle Title & Thumbnail */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                            <Image
                              src={coverImage}
                              alt={v.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/vehicles/${vehicleId}/edit`}
                              className="font-black text-neutral-900 hover:text-[#ff6a00] transition-colors line-clamp-1 block"
                            >
                              {v.name}
                            </Link>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {v.year} {v.make} · {v.modelCode || 'JDM'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Stock ID */}
                      <td className="py-2.5 px-3 font-mono font-bold text-neutral-800 text-[11px]">
                        {v.stockId}
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 text-neutral-600 font-medium text-[11px]">
                        {v.category || v.bodyType || 'SUV'}
                      </td>

                      {/* Mileage */}
                      <td className="py-2.5 px-3 font-mono text-neutral-600 text-[11px]">
                        {v.mileageKm ? `${Number(v.mileageKm).toLocaleString()} km` : v.mileage || '—'}
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-3 font-black text-neutral-950 text-xs">
                        USD {Number(v.priceUSD || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        {isSold ? (
                          <span className="px-2 py-0.5 bg-neutral-800 text-white text-[9px] font-black rounded uppercase">
                            Sold
                          </span>
                        ) : isReserved ? (
                          <span className="px-2 py-0.5 bg-amber-600 text-white text-[9px] font-black rounded uppercase">
                            Reserved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded uppercase">
                            In Yard
                          </span>
                        )}
                      </td>

                      {/* Featured */}
                      <td className="py-2.5 px-3">
                        {v.isFeatured ? (
                          <span className="text-[#ff6a00] font-black text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {v.slug && (
                            <a
                              href={`/vehicles/${v.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 hover:text-neutral-800 p-1"
                              title="Public View"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <Link
                            href={`/admin/vehicles/${vehicleId}/edit`}
                            className="px-2.5 py-1 bg-white hover:bg-[#fff4eb] text-neutral-700 hover:text-[#ff6a00] border border-neutral-300 hover:border-[#ffd1ad] rounded text-[11px] font-bold transition-colors"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteId(vehicleId || '')}
                            className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-neutral-900 mb-1">Confirm Vehicle Deletion</h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Are you sure you want to delete this vehicle from the database? This action will remove it from the public showroom immediately.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
