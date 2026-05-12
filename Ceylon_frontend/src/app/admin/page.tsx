'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, Car, LogOut, Loader2, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('inquiries');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchData(token);
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [inqRes, vehRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`, config),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, config)
      ]);
      setInquiries(inqRes.data.data);
      setVehicles(vehRes.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.data.token);
      setIsLoggedIn(true);
      fetchData(res.data.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(vehicles.filter((v: any) => v._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="admin@ceylon.lk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-dark text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-10 text-primary">Ceylon Admin</h2>
        <nav className="space-y-4 flex-1">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'inquiries' ? 'bg-primary text-white' : 'hover:bg-white/10'}`}
          >
            <Users size={20} /> Inquiries
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'vehicles' ? 'bg-primary text-white' : 'hover:bg-white/10'}`}
          >
            <Car size={20} /> Vehicles
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors mt-auto">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-dark capitalize">{activeTab} Management</h1>
        </header>

        {activeTab === 'inquiries' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Message</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inq: any) => (
                  <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{inq.name}</td>
                    <td className="px-6 py-4">{inq.phone}</td>
                    <td className="px-6 py-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold">{inq.vehicle}</span></td>
                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{inq.message}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((veh: any) => (
              <div key={veh._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-40">
                  <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
                  <button onClick={() => deleteVehicle(veh._id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{veh.name}</h3>
                  <p className="text-primary font-bold">LKR {veh.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
