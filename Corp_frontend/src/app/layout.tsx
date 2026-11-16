import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/MainLayout';
import { SettingsProvider } from '@/context/SettingsContext';
import { MarketProvider } from '@/context/MarketContext';

export const metadata: Metadata = {
  title: 'Makers Corp Japan — Global Vehicle Export Marketplace',
  description:
    'Browse genuine vehicles sourced from Japan. Transparent FOB and CIF pricing, destination eligibility checks for India, Sri Lanka, and Africa, and written quotations direct from Tokyo.',
  keywords:
    'Japan car export, Japanese used cars, buy cars from Japan, import JDM cars, Japan vehicle export marketplace, Makers Corp Japan, vehicles sourced from Japan',
  openGraph: {
    title: 'Makers Corp Japan — Vehicle Export Marketplace',
    description: 'Find your next vehicle in Japan. Browse stock, check destination availability, and request a written quotation.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Makers Corp Japan'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#EA580C'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-[#0F172A] antialiased">
        <SettingsProvider>
          <MarketProvider>
            <MainLayout>{children}</MainLayout>
          </MarketProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
