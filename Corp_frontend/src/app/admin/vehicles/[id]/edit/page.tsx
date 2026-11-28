'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VehicleForm } from '@/components/admin/VehicleForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/vehicles/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setVehicle(data.data);
        } else {
          setError('Vehicle not found.');
        }
      } catch (err: any) {
        setError('Failed to load vehicle record.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin mb-3" />
        <span className="text-xs font-bold text-neutral-600">Loading vehicle specifications...</span>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
          <ArrowLeft className="w-6 h-6" />
        </div>
        <h2 className="text-base font-black text-neutral-900 mb-1">{error || 'Vehicle Not Found'}</h2>
        <p className="text-xs text-neutral-500 mb-4">The requested vehicle record could not be loaded.</p>
        <Link
          href="/admin/vehicles"
          className="px-4 py-2 bg-neutral-900 hover:bg-[#ff6a00] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Return to Vehicle Inventory
        </Link>
      </div>
    );
  }

  return <VehicleForm initialData={vehicle} isEdit={true} />;
}
