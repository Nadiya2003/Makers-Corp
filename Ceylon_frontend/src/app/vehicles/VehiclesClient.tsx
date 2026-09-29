'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Settings, ArrowRight, Loader2, Sparkles, Filter } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

import { VehicleDetailModal } from '@/components/VehicleDetailModal';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface Vehicle {
  _id: string;
  name: string;
  image: string;
  images?: string[];
  category: string;
  year: string;
  fuel: string;
  mileage: string;
  price: string;
  engine: string;
  transmission: string;
  drive: string;
  seats: number;
  color: string;
  description: string;
  status: string;
}

export function VehiclesClient() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  // Derive unique categories/fuels from vehicles for dropdowns (or hardcode standard ones)
  const categories = ['All', 'SUV', 'Sedan', 'Hatchback', 'Van', 'Other'];
  const fuels = ['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const statuses = ['All', 'Available', 'Reserved', 'Sold'];
  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under 15M', value: 'under_15' },
    { label: '15M - 25M', value: '15_25' },
    { label: '25M - 35M', value: '25_35' },
    { label: 'Over 35M', value: 'over_35' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchVehicles = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
        const baseUrl = apiUrl.replace(/\/api$/, '');
        const getImageUrl = (url: string) => {
          if (!url) return '';
          if (url.startsWith('http')) return normalizeImageUrl(url);
          return normalizeImageUrl(`${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`);
        };

        // Fetch all vehicles (no featured=true flag)
        const response = await axios.get(`${apiUrl}/vehicles`);
        if (response.data.success) {
          const processedVehicles = response.data.data.map((v: any) => ({
            ...v,
            image: getImageUrl(v.image),
            images: v.images ? v.images.map((img: string) => getImageUrl(img)) : []
          }));
          setVehicles(processedVehicles);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load the vehicle inventory.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const openDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Helper to extract numbers from price strings like "18M - 25M", "18 Lakhs - 25 Lakhs", etc.
  const parseVehiclePrice = (priceStr: string) => {
    const parts = (priceStr || '').split('-').map(s => s.trim());

    const parseSingleValue = (valStr: string) => {
      const clean = valStr.trim().toUpperCase().replace(/,/g, '');
      const numMatch = clean.match(/\d+(?:\.\d+)?/);
      if (!numMatch) return 0;
      const num = parseFloat(numMatch[0]);

      if (clean.includes('M') || clean.includes('MILLION')) {
        return num * 1000000;
      }
      if (clean.includes('LAKH') || clean.includes('LAKS') || clean.includes('LAK') || clean.includes('LAC')) {
        return num * 100000;
      }
      if (clean.includes('B') || clean.includes('BILLION')) {
        return num * 1000000000;
      }
      if (clean.includes('T') || clean.includes('K') || clean.includes('THOUSAND')) {
        return num * 1000;
      }

      // Default/no unit specified
      if (num < 1000) {
        return num * 1000000; // Legacy default to Millions (M)
      }
      return num;
    };

    const parsed = parts.map(part => parseSingleValue(part));
    const min = parsed[0] || 0;
    const max = parsed.length > 1 ? (parsed[1] || min) : min;
    return { min, max };
  };

  // Filter Logic
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
    const matchesFuel = fuelFilter === 'All' || v.fuel === fuelFilter;
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;

    let matchesPrice = true;
    if (priceFilter !== 'All') {
      const { min, max } = parseVehiclePrice(v.price);
      if (priceFilter === 'under_15') {
        matchesPrice = max < 15000000;
      } else if (priceFilter === '15_25') {
        matchesPrice = min <= 25000000 && max >= 15000000;
      } else if (priceFilter === '25_35') {
        matchesPrice = min <= 35000000 && max >= 25000000;
      } else if (priceFilter === 'over_35') {
        matchesPrice = min > 35000000;
      }
    }

    return matchesSearch && matchesCategory && matchesFuel && matchesStatus && matchesPrice;
  });

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gray-50">
      {/* Page Header */}
      <div className="bg-dark text-white py-12 sm:py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-primary/20"
          >
            <Sparkles className="w-3 h-3" /> Premium Selection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4 uppercase tracking-tighter"
          >
            Vehicle <span className="text-primary italic">Inventory</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-medium"
          >
            Explore our complete collection of high-quality Japanese vehicles ready for direct import to Sri Lanka.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 w-full">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Inventory...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-red-100 shadow-sm">
            <p className="text-red-500 font-bold mb-6 text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
            >
              Refresh Inventory
            </button>
          </div>
        ) : (
          <>
            {/* Premium Filter Bar */}
            <div className="bg-white rounded-[2rem] p-4 sm:p-6 mb-10 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Search Vehicle</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm focus:border-primary transition-all outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fuel Type</label>
                  <select
                    value={fuelFilter}
                    onChange={(e) => setFuelFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm focus:border-primary transition-all outline-none"
                  >
                    {fuels.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price Range</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm focus:border-primary transition-all outline-none"
                  >
                    {priceRanges.map(pr => <option key={pr.value} value={pr.value}>{pr.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm focus:border-primary transition-all outline-none"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-dark font-black text-2xl mb-2">No Matches Found</p>
                <p className="text-gray-500 text-sm max-w-md mx-auto">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setFuelFilter('All'); setStatusFilter('All'); setPriceFilter('All'); }}
                  className="mt-6 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group relative bg-white rounded-none p-3.5 sm:p-4 shadow-sm hover:shadow-2xl border border-gray-200/90 hover:border-primary hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top showroom accent indicator on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div>
                      <div className="relative h-[220px] rounded-none overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <button
                            onClick={() => openDetails(vehicle)}
                            className="w-full bg-white/95 backdrop-blur-md text-dark py-3.5 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-lg active:scale-[0.98] border border-white/60"
                          >
                            Quick View
                          </button>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-none text-[9px] font-black text-dark uppercase tracking-widest border-l-2 border-primary shadow-sm">
                            {vehicle.year}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1.5 bg-primary text-white backdrop-blur-md rounded-none text-[9px] font-black uppercase tracking-widest shadow-sm">
                            {vehicle.status}
                          </span>
                        </div>
                      </div>

                      <div className="px-1 pb-1">
                        <h4 className="font-display font-black text-lg text-dark leading-tight uppercase group-hover:text-primary transition-colors mb-3 line-clamp-1">
                          {vehicle.name}
                        </h4>

                        <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50/80 backdrop-blur-sm rounded-none border border-gray-200/60">
                          <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500 border-r border-gray-200">
                            <Fuel className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] font-bold uppercase truncate">{vehicle.fuel}</span>
                          </div>
                          <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500">
                            <Settings className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] font-bold uppercase truncate">{vehicle.transmission}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-1 pb-1">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
                          <span className="text-lg font-black text-primary leading-none">
                            {/^(USD|JPY|EUR|GBP|AUD|LKR)/i.test(vehicle.price.trim()) ? vehicle.price : `LKR ${vehicle.price}`}
                          </span>
                        </div>
                        <button
                          onClick={() => openDetails(vehicle)}
                          aria-label="View vehicle details"
                          className="w-10 h-10 rounded-none bg-gray-100 flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-white transition-all duration-300 active:scale-95 border border-gray-200/60 group-hover:border-primary"
                        >
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
