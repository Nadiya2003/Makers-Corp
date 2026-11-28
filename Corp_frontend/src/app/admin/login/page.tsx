'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@makers-corp.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect already-authenticated users straight to the dashboard
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    if (token) {
      sessionStorage.setItem('adminToken', token);
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.data?.token) {
        sessionStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminToken', data.data.token);
        sessionStorage.setItem('adminUser', JSON.stringify(data.data));
        localStorage.setItem('adminUser', JSON.stringify(data.data));
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection to Tokyo backend server failed. Please verify the API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a0b] relative overflow-hidden px-4">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 bg-[#121316] border border-white/10 rounded-3xl shadow-2xl relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto mb-4 shadow-lg shadow-orange-600/30">
            MC
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            MAKERS CORP JAPAN
          </h1>
          <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mt-1">
            Tokyo Operations Desk · CMS Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-xs flex items-center gap-3 font-semibold">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black text-zinc-300 mb-2 uppercase tracking-wider">
              Operator Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-500 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="admin@makers-corp.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-300 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-white placeholder-zinc-500 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50 uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating Tokyo Desk...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>256-Bit Encrypted Admin Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
