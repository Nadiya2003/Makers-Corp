'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Car, 
  Newspaper, 
  Mail, 
  ArrowRight,
  Loader2,
  Sparkles,
  Plus,
  Home,
  Globe2,
  CheckCircle2,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({
    vehicles: [],
    inquiries: [],
    articles: [],
    users: [],
    reviews: [],
    loading: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      
      const [vRes, iRes, aRes, uRes, rRes] = await Promise.all([
        fetch(`${apiUrl}/vehicles`),
        fetch(`${apiUrl}/inquiries`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/articles`),
        fetch(`${apiUrl}/auth`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/reviews/admin`, { headers: { 'Authorization': `Bearer ${token}` } }).catch(() => fetch(`${apiUrl}/reviews`))
      ]);

      const [vData, iData, aData, uData, rData] = await Promise.all([
        vRes.json(), 
        iRes.json(),
        aRes.json(),
        uRes.json(),
        rRes.json().catch(() => ({ success: false, data: [] }))
      ]);

      setData({
        vehicles: vData.success ? vData.data : [],
        inquiries: iData.success ? iData.data : [],
        articles: aData.success ? aData.data : [],
        users: uData.success ? uData.data : [],
        reviews: rData.success ? rData.data : [],
        loading: false
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const stats = [
    { label: 'Physical Vehicles', value: data.vehicles.length.toString(), icon: Car, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/vehicles' },
    { label: 'Customer Reviews', value: data.reviews.length.toString(), icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/reviews' },
    { label: 'News & Export Guides', value: data.articles.length.toString(), icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/news' },
    { label: 'Customer Inquiries', value: data.inquiries.length.toString(), icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/inquiries' },
  ];

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Assembling Tokyo Operations Desk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Tokyo Operations Desk · Connected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
            Makers Corp Japan CMS
          </h1>
          <p className="text-gray-500 font-medium text-xs sm:text-sm">
            Live database management for vehicle inventory, homepage sections, editorial guides, and destination markets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Live Site</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/admin/vehicles/new"
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.link}
            className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group block"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={20} />
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1 tracking-tighter">{stat.value}</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Launchpad */}
      <div className="bg-gradient-to-r from-zinc-900 to-black text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Fast CMS Actions</span>
          </div>
          <h2 className="text-lg font-black tracking-tight">Need to update the homepage or post a new export update?</h2>
          <p className="text-xs text-zinc-400 max-w-xl">
            Edit the Hero Carousel slides, Land Cruiser spotlight, quick search tags, and Mount Fuji inventory banner with instant MongoDB synchronization.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/homepage"
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
          >
            <Home size={14} />
            <span>Manage Homepage</span>
          </Link>
          <Link
            href="/admin/news"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-white/10"
          >
            <Newspaper size={14} />
            <span>Publish Article</span>
          </Link>
          <Link
            href="/admin/destinations"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 border border-white/10"
          >
            <Globe2 size={14} />
            <span>Destinations</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Recent Inquiries</h3>
              <p className="text-xs text-gray-400">Customer export requests and proforma queries</p>
            </div>
            <Link href="/admin/inquiries" className="text-orange-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-gray-50 flex-grow">
            {data.inquiries.slice(0, 5).map((inq: any) => (
              <div key={inq._id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md shrink-0">
                  {inq.name ? inq.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-gray-900 font-bold text-xs uppercase truncate">{inq.name || 'Anonymous Client'}</h4>
                  <p className="text-gray-400 text-[11px] truncate">
                    {inq.vehicle ? `Vehicle: ${inq.vehicle}` : inq.email || inq.phone || 'Export Inquiry'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] uppercase font-black tracking-widest rounded-md border border-orange-100">
                    Pending
                  </span>
                </div>
              </div>
            ))}
            {data.inquiries.length === 0 && (
              <div className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                No recent inquiries.
              </div>
            )}
          </div>
        </div>

        {/* Physical Yard Inventory Status */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Export Inventory Status</h3>
              <p className="text-xs text-gray-400">Physical units staging in Yokohama & Tokyo yards</p>
            </div>
            <Link href="/admin/vehicles" className="text-orange-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
              Manage Stock <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Active Yard Units
                </span>
                <span className="text-sm font-black text-gray-900">{data.vehicles.length} Units Ready</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-orange-600 h-full w-[85%] rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Available</p>
                <p className="text-2xl font-black text-emerald-700">
                  {data.vehicles.filter((v: any) => v.status === 'Available' || v.availability?.includes('Available')).length || data.vehicles.length}
                </p>
              </div>
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Reserved</p>
                <p className="text-2xl font-black text-amber-700">
                  {data.vehicles.filter((v: any) => v.status === 'Reserved').length}
                </p>
              </div>
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-center">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Articles</p>
                <p className="text-2xl font-black text-blue-700">{data.articles.length}</p>
              </div>
            </div>

            <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-orange-600 shrink-0" />
              <p className="text-xs text-orange-950 font-medium">
                All physical yard units undergo independent 150-point pre-export mechanical and radiation audits prior to bill of lading issuance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
