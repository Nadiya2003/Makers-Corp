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
  Phone
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Settings, label: 'Website Settings', href: '/admin/settings' },
  { icon: Layout, label: 'Header & Footer', href: '/admin/appearance' },
  { icon: Home, label: 'Homepage Content', href: '/admin/homepage' },
  { icon: Car, label: 'Vehicles', href: '/admin/vehicles' },
  { icon: Gavel, label: 'Auctions', href: '/admin/auctions' },
  { icon: Mail, label: 'Inquiries', href: '/admin/inquiries' },
  { icon: ImageIcon, label: 'Media Manager', href: '/admin/media' },
  { icon: Info, label: 'About Page', href: '/admin/about' },
  { icon: Phone, label: 'Contact Details', href: '/admin/contact-settings' },
  { icon: Type, label: 'SEO Settings', href: '/admin/seo' },
  { icon: Users, label: 'User Management', href: '/admin/users' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <aside className="w-72 bg-black text-slate-300 h-screen sticky top-0 flex flex-col border-r border-white/10 shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm">M</div>
          Makers Admin
        </h1>
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
  );
}
