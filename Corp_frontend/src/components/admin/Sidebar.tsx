'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUnsavedChangesContext } from '@/context/UnsavedChangesContext';
import { useSettings } from '@/context/SettingsContext';
import { 
  LayoutDashboard, 
  Settings, 
  Home, 
  Image as ImageIcon, 
  Mail, 
  Users, 
  LogOut, 
  Car, 
  Gavel,
  Type,
  Layout,
  Info,
  Phone,
  X,
  MessageSquare,
  Truck,
  Newspaper,
  Globe2,
  Plus
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Home, label: 'Homepage Content', href: '/admin/homepage' },
  { icon: Car, label: 'Vehicle Inventory', href: '/admin/vehicles' },
  { icon: Plus, label: 'Add New Vehicle', href: '/admin/vehicles/new' },
  { icon: Truck, label: 'Commercial Vehicles', href: '/admin/commercial-vehicles' },
  { icon: MessageSquare, label: 'Customer Reviews', href: '/admin/reviews' },
  { icon: Newspaper, label: 'News & Articles', href: '/admin/news' },
  { icon: Globe2, label: 'Destinations', href: '/admin/destinations' },
  { icon: Mail, label: 'Customer Inquiries', href: '/admin/inquiries' },
  { icon: ImageIcon, label: 'Media Library', href: '/admin/media' },
  { icon: Layout, label: 'Header & Footer', href: '/admin/appearance' },
  { icon: Info, label: 'About Page', href: '/admin/about' },
  { icon: Phone, label: 'Contact Details', href: '/admin/contact-settings' },
  { icon: Type, label: 'SEO Settings', href: '/admin/seo' },
  { icon: Settings, label: 'Global Settings', href: '/admin/settings' },
  { icon: Users, label: 'User & Security', href: '/admin/users' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { requestNavigation, isDirty } = useUnsavedChangesContext();
  const { settings } = useSettings();

  const handleLogout = async () => {
    const ok = await requestNavigation('/admin/login');
    if (!ok) return;
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleNavClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname === href) {
      if (window.innerWidth < 1024) onClose();
      return;
    }

    if (isDirty) {
      e.preventDefault();
      const ok = await requestNavigation(href);
      if (ok) {
        if (window.innerWidth < 1024) onClose();
        router.push(href);
      }
      return;
    }

    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 bg-[#0c0d0e] text-slate-300 flex flex-col border-r border-white/10 shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:z-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-600/30">
              MC
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider uppercase leading-none">
                MAKERS CORP
              </h1>
              <p className="text-[10px] font-bold text-orange-500 tracking-widest uppercase mt-1">
                JAPAN CMS DESK
              </p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-zinc-400'} />
                <span>{item.label}</span>
                {isActive && isDirty && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Footer */}
        <div className="p-4 border-t border-white/5 bg-black/40">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tokyo Online</span>
            </div>
            <Link 
              href="/" 
              target="_blank" 
              className="text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider transition-colors"
            >
              Live Site ↗
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
