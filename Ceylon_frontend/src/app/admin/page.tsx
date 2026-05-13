'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Car, 
  Gavel, 
  Mail, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({
    vehicles: [],
    inquiries: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      
      const [vRes, iRes] = await Promise.all([
        fetch(`${apiUrl}/vehicles`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/inquiries`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const [vData, iData] = await Promise.all([vRes.json(), iRes.json()]);

      setData({
        vehicles: vData.success ? vData.data : [],
        inquiries: iData.success ? iData.data : [],
        loading: false
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data');
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const stats = [
    { label: 'Total Vehicles', value: data.vehicles.length.toString(), icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Live Auctions', value: '0', icon: Gavel, color: 'text-orange-600', bg: 'bg-orange-50' }, // Auctions logic TBD
    { label: 'Total Inquiries', value: data.inquiries.length.toString(), icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Listings', value: data.vehicles.filter((v: any) => v.status === 'Available').length.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Assembling Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium">Real-time metrics and operational status.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-xs font-black uppercase tracking-widest text-gray-400">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-1 tracking-tighter">{stat.value}</h3>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Inquiries */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Recent Inquiries</h3>
            <Link href="/admin/inquiries" className="text-orange-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-grow">
            {data.inquiries.slice(0, 5).map((inq: any) => (
              <div key={inq._id} className="p-8 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg">
                  {inq.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <h4 className="text-gray-900 font-black text-sm uppercase tracking-tight">{inq.name}</h4>
                  <p className="text-gray-400 text-[11px] font-bold uppercase truncate max-w-[200px]">Interest: {inq.vehicle}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <span className="px-3 py-1 bg-orange-600/5 text-orange-600 text-[9px] uppercase font-black tracking-widest rounded-lg border border-orange-600/10">New</span>
                </div>
              </div>
            ))}
            {data.inquiries.length === 0 && (
              <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">
                No recent inquiries.
              </div>
            )}
          </div>
        </div>

        {/* Live Auctions Placeholder */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Inventory Status</h3>
            <Link href="/admin/vehicles" className="text-orange-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-10 space-y-8">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Stock Level</span>
                  <span className="text-sm font-black text-gray-900">{data.vehicles.length} Units</span>
               </div>
               <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-600 h-full w-[65%]" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Sold</p>
                  <p className="text-2xl font-black text-blue-600">{data.vehicles.filter((v: any) => v.status === 'Sold').length}</p>
               </div>
               <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">Reserved</p>
                  <p className="text-2xl font-black text-amber-600">{data.vehicles.filter((v: any) => v.status === 'Reserved').length}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
