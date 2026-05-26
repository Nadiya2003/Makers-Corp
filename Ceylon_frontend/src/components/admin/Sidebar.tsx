'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Layers, 
  Home, 
  Image as ImageIcon, 
  Mail, 
  Users, 
  LogOut, 
  Car, 
  Gavel,
  Type,
  Search,
  Layout,
  Info,
  Phone,
  X,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Settings, label: 'Website Settings', href: '/admin/settings' },
  { icon: Layout, label: 'Header & Footer', href: '/admin/appearance' },
  { icon: Home, label: 'Homepage Content', href: '/admin/homepage' },
  { icon: Car, label: 'Vehicles', href: '/admin/vehicles' },
  { icon: Gavel, label: 'Auctions', href: '/admin/auctions' },
  { icon: Mail, label: 'Inquiries', href: '/admin/inquiries' },
  { icon: ImageIcon, label: 'Media Manager', href: '/admin/media' },
  { icon: MessageSquare, label: 'Popup Ad', href: '/admin/popup' },
  { icon: Info, label: 'About Page', href: '/admin/about' },
  { icon: Phone, label: 'Contact Details', href: '/admin/contact-settings' },
  { icon: Type, label: 'SEO Settings', href: '/admin/seo' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <>
      {/* Backdrop for mobile/tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 bg-black text-slate-300 flex flex-col border-r border-white/10 shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:z-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm">M</div>
            Makers Admin
          </h1>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${
                isActive 
                  ? 'bg-orange-600/10 text-orange-500 border-orange-600/20' 
                  : 'border-transparent hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-red-600/10 hover:text-red-500 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
}
