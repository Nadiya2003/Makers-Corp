'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Gauge, ArrowRight, Loader2, Sparkles, Filter } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

import { VehicleDetailModal } from '@/components/VehicleDetailModal';

interface Vehicle {
  _id: string;
  name: string;
  image: string;
  images?: string[];
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchVehicles = async () => {
      try {
        // Fetch all vehicles (no featured=true flag)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`);
        if (response.data.success) {
          setVehicles(response.data.data);
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
        ) : vehicles.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Filter className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-dark font-black text-2xl mb-2">No Vehicles Found</p>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">We are currently updating our inventory. Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group relative bg-white rounded-[2.5rem] p-3 shadow-soft border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-[220px] rounded-[2rem] overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                     <button 
                       onClick={() => openDetails(vehicle)}
                       className="w-full bg-white text-dark py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                     >
                       Quick View
                     </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[9px] font-black text-dark uppercase tracking-widest shadow-sm">
                      {vehicle.year}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-primary/90 text-white backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                <div className="px-3 pb-3">
                  <h4 className="font-display font-black text-lg text-dark leading-tight uppercase group-hover:text-primary transition-colors mb-3 line-clamp-1">
                    {vehicle.name}
                  </h4>

                  <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-2xl">
                    <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500 border-r border-gray-200">
                      <Fuel className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase truncate">{vehicle.fuel}</span>
                    </div>
                    <div className="flex flex-1 items-center justify-center gap-1.5 text-gray-500">
                      <Gauge className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase truncate">{vehicle.mileage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
                       <span className="text-lg font-black text-primary leading-none">LKR {vehicle.price}</span>
                    </div>
                    <button
                      onClick={() => openDetails(vehicle)}
                      className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-white group-hover:rotate-45 transition-all duration-300 active:scale-95"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
