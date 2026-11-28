import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchLiveVehicle, fetchLiveVehicles } from '@/lib/api';
import { getVehicleByStockIdOrSlug } from '@/data';
import { VehicleDetailClient } from './VehicleDetailClient';

interface Props {
  params: { slug: string };
}

// Allow any slug that wasn't pre-rendered — critical for admin-uploaded vehicles
export const dynamicParams = true;

// Pre-render known static vehicles at build time; all others render on-demand
export async function generateStaticParams() {
  try {
    // Try to get live vehicles from DB; fall back to empty (all rendered on-demand)
    const liveVehicles = await fetchLiveVehicles().catch(() => []);
    return liveVehicles
      .filter((v) => v.slug)
      .map((v) => ({ slug: v.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehicle =
    (await fetchLiveVehicle(params.slug)) || getVehicleByStockIdOrSlug(params.slug);

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found — Makers Corp Japan',
      description:
        'The requested vehicle is not available in our current Japanese export inventory.'
    };
  }

  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockId}) — Makers Corp Japan`,
    description: `Export quotation for ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.grade}. Chassis: ${vehicle.modelCode}, Mileage: ${vehicle.mileageKm?.toLocaleString?.()} km. FOB and CIF quotes available from Japan.`,
    openGraph: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} — Makers Corp Japan`,
      description: `Stock: ${vehicle.stockId} · Grade ${vehicle.conditionGrade} · Mileage: ${vehicle.mileageKm?.toLocaleString?.()} km`,
      images:
        vehicle.images && vehicle.images[0]
          ? [{ url: vehicle.images[0] }]
          : []
    }
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  // Try live DB first (new admin-uploaded vehicles will only be here)
  const vehicle =
    (await fetchLiveVehicle(params.slug)) || getVehicleByStockIdOrSlug(params.slug);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailClient vehicle={vehicle!} />;
}
