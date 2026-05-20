import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ceylon Imports — Premium Japanese Vehicles Direct to Sri Lanka',
  description:
    'Import premium Japanese vehicles directly to Sri Lanka with transparent pricing, live auction access, and end-to-end handling. Better prices. Trusted process.',
  keywords: 'Japan car import, Sri Lanka, JDM, vehicle import, Ceylon Imports',
  openGraph: {
    title: 'Ceylon Imports — Premium Japanese Vehicles',
    description: 'Your trusted partner for importing premium Japanese vehicles to Sri Lanka.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

import { MainLayout } from '@/components/MainLayout';
import { SettingsProvider } from '@/context/SettingsContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gray-50">
        <SettingsProvider>
          <MainLayout>{children}</MainLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}
