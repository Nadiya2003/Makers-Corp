'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSettings } from '@/context/SettingsContext';

export function Header() {
  const { settings, loading } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      router.push('/' + hash);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'VEHICLES', hash: '#vehicles' },
    { name: 'HOW IT WORKS', hash: '#how-it-works' },
    { name: 'WHY US', hash: '#why-us' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  const siteName = settings?.siteName || 'MAKERS CEYLON';
  const contactNumber = settings?.footer?.phone || '077 123 4567';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white border-b border-gray-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-50">
            {settings?.logo ? (
              <img src={settings.logo} alt={siteName} className="w-10 h-10 object-contain" />
            ) : (
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col -gap-1">
              <span className="font-display font-black text-xl tracking-tight text-dark leading-none">
                {siteName}
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.1em]">
                IMPORT YOUR DREAM
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) =>
              link.path ? (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-[11px] lg:text-[13px] font-bold tracking-wider transition-colors hover:text-primary ${
                    pathname === link.path ? 'text-primary' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.hash!)}
                  className="text-[11px] lg:text-[13px] font-bold tracking-wider text-gray-700 hover:text-primary transition-colors"
                >
                  {link.name}
                </button>
              )
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <div className="flex items-center gap-2 text-dark font-bold">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">{contactNumber}</span>
            </div>
            <a
              href={`https://wa.me/94${contactNumber.replace(/\s/g, '').replace(/^0/, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 xl:px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/20 uppercase"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 p-2 -mr-2 flex items-center justify-center text-dark hover:bg-gray-100 rounded-lg transition-all focus:outline-none active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 md:hidden max-h-[calc(100vh-60px)] overflow-y-auto rounded-b-2xl safe-bottom"
          >
            <div className="flex flex-col px-4 py-4 gap-1 sm:gap-2">
              {navLinks.map((link) =>
                link.path ? (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-[13px] sm:text-sm font-bold tracking-wider px-4 py-3 min-h-[44px] flex items-center rounded-xl transition-all active:scale-[0.98] ${
                      pathname === link.path ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.hash!)}
                    className="text-[13px] sm:text-sm font-bold tracking-wider px-4 py-3 min-h-[44px] flex items-center w-full text-left transition-all active:scale-[0.98] rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary"
                  >
                    {link.name}
                  </button>
                )
              )}
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                <div className="flex items-center justify-center gap-2 text-dark font-bold">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-[13px] tracking-wide">{contactNumber}</span>
                </div>
                <a
                  href={`https://wa.me/94${contactNumber.replace(/\s/g, '').replace(/^0/, '').replace(/^\+94/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-primary text-white px-4 py-3 rounded-lg text-[13px] font-bold shadow-sm active:scale-95 transition-all uppercase"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
