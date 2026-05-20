'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Menu } from 'lucide-react';

// Routes that don't require authentication
const PUBLIC_ADMIN_ROUTES = ['/admin/login', '/admin/register'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublicRoute = PUBLIC_ADMIN_ROUTES.includes(pathname);

  useEffect(() => {
    // Skip auth check for public routes (login, register)
    if (isPublicRoute) {
      setChecking(false);
      return;
    }

    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      // No token — redirect to login immediately
      router.replace('/admin/login');
    } else {
      setIsAuthorized(true);
      setChecking(false);
    }
  }, [pathname, router, isPublicRoute]);

  // Public routes (login/register): render without sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // While we're verifying the token, show a full-screen loader
  // This prevents any dashboard flash before the redirect happens
  if (checking || !isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-orange-600 animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Verifying Access...
        </p>
      </div>
    );
  }

  // Authenticated — render dashboard layout with sidebar
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile/Tablet Topbar */}
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600 rounded-md"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-gray-900">Makers Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
