'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

export default function AdminRegisterDisabled() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090a0b] relative overflow-hidden px-4">
      <div className="w-full max-w-md p-8 sm:p-10 bg-[#121316] border border-white/10 rounded-3xl shadow-2xl relative z-10 text-center">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <Lock size={32} />
        </div>

        <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
          Registration Disabled
        </h1>
        <p className="text-zinc-400 text-xs leading-relaxed mb-8">
          Public self-registration is closed for security compliance. Administrative accounts are provisioned exclusively through internal Tokyo headquarters authorization.
        </p>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-orange-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400">
              If you have been assigned administrative credentials by Tokyo Operations Desk, please sign in with your authorized email and password.
            </p>
          </div>
        </div>

        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20 transition-all"
        >
          <ArrowLeft size={16} />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
