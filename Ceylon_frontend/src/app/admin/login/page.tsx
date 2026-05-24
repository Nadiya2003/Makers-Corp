'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect already-authenticated users straight to the dashboard
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('adminToken', data.data.token);
        sessionStorage.setItem('adminUser', JSON.stringify(data.data));
        router.push('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-200 rounded-full blur-[100px]" />

      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-3xl shadow-xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-black/10">
            M
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Admin Portal</h1>
          <p className="text-gray-500 font-medium">Access the Makers Ceylon dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-medium"
              placeholder="admin@makersceylon.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-600/20 transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
