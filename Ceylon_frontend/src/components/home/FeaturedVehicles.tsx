'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Gauge, ArrowRight, Loader2, Sparkles } from 'lucide-react';
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

export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles?featured=true`);
        if (response.data.success) {
          setVehicles(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load featured vehicles.');
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

  const scrollToInquiry = () => {
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vehicles" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
            >
              <Sparkles className="w-3 h-3" /> Hand-Picked Quality
            </motion.div>
            <h2 className="font-display font-black text-5xl sm:text-6xl text-dark leading-none uppercase tracking-tighter">
              Featured <span className="text-primary italic">Inventory</span>
            </h2>
            <p className="mt-4 text-gray-500 font-medium text-lg">
              Explore our exclusive selection of premium Japanese vehicles, available for immediate import.
            </p>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            onClick={scrollToInquiry}
            className="flex items-center gap-3 text-dark font-black uppercase tracking-[0.15em] text-sm group"
          >
            Explore Full Collection
            <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
               <ArrowRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 w-full">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Auction Data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-red-500 font-bold mb-6 text-xl">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
            >
              Refresh Inventory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative"
              >
                <div className="relative h-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-6 bg-gray-100">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <button 
                       onClick={() => openDetails(vehicle)}
                       className="w-full bg-white text-dark py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl"
                     >
                       Quick View Details
                     </button>
                  </div>
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-dark uppercase tracking-widest shadow-lg">
                      {vehicle.year} Model
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-display font-black text-xl text-dark leading-tight uppercase group-hover:text-primary transition-colors">
                      {vehicle.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Fuel className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">{vehicle.fuel}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Gauge className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase">{vehicle.mileage}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-gray-100">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Starting From</span>
                       <span className="text-xl font-black text-primary">LKR {vehicle.price}</span>
                    </div>
                    <button
                      onClick={() => openDetails(vehicle)}
                      className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-dark group-hover:bg-primary group-hover:text-white group-hover:rotate-45 transition-all duration-500"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <VehicleDetailModal
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <button
          onClick={scrollToInquiry}
          className="mt-20 w-full lg:hidden flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 text-dark font-black py-6 rounded-[2rem] transition-all uppercase tracking-widest text-xs"
        >
          View Full Collection
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
