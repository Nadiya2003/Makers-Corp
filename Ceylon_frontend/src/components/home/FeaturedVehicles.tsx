'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Fuel, Gauge, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function FeaturedVehicles() {
  const vehicles = [
    {
      id: 1,
      name: 'Toyota Land Cruiser Prado',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      year: '2023',
      fuel: 'Petrol',
      mileage: '4,500 km',
      price: '38,500,000',
    },
    {
      id: 2,
      name: 'Honda Vezel e:HEV',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      year: '2022',
      fuel: 'Hybrid',
      mileage: '12,000 km',
      price: '14,200,000',
    },
    {
      id: 3,
      name: 'Suzuki Swift RS',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      year: '2021',
      fuel: 'Petrol',
      mileage: '28,000 km',
      price: '8,500,000',
    },
    {
      id: 4,
      name: 'Toyota CH-R G-T',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      year: '2020',
      fuel: 'Petrol',
      mileage: '35,000 km',
      price: '12,800,000',
    },
  ];

  const scrollToInquiry = () => {
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="vehicles" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
              Premium Selection
            </h2>
            <h3 className="font-display font-bold text-4xl text-dark">Featured Vehicles</h3>
          </div>
          <button
            onClick={scrollToInquiry}
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors group"
          >
            View All Vehicles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-dark">
                  Ready to Ship
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-display font-bold text-lg text-dark mb-4 truncate" title={vehicle.name}>
                  {vehicle.name}
                </h4>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-700">{vehicle.year}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
                    <Fuel className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-700">{vehicle.fuel}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
                    <Gauge className="w-4 h-4 text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-700">{vehicle.mileage}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Estimated Price</p>
                    <p className="font-display font-bold text-primary text-lg">LKR {vehicle.price}</p>
                  </div>
                  <button
                    onClick={scrollToInquiry}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={scrollToInquiry}
          className="mt-10 w-full md:hidden flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-dark font-semibold py-4 rounded-xl transition-colors"
        >
          View All Vehicles
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
