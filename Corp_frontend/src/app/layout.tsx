import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ceylon Imports — Premium Japanese Vehicles Direct to Sri Lanka',
  description:
    'Import premium Japanese vehicles directly to Sri Lanka with transparent pricing, live auction access, and end-to-end handling. Better prices. Trusted process.',
  keywords: 'Japan car import, Sri Lanka, JDM, vehicle import, Ceylon Imports, Makers Ceylon, Japanese car importer',
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
import { normalizeSettingsImages } from '@/lib/imageUtils';

async function fetchInitialSettings() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/settings`, { 
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? normalizeSettingsImages(data.data) : null;
  } catch (err) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSettings = await fetchInitialSettings();


  return (
    <html lang="en">
      <head>
        {initialSettings?.logo && <link rel="icon" href={initialSettings.logo} />}
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-gray-50">
        <SettingsProvider initialSettings={initialSettings}>
          <MainLayout>{children}</MainLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}
