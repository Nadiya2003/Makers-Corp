import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVehicleByStockIdOrSlug, vehicles } from '@/data';
import { VehicleDetailClient } from './VehicleDetailClient';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return vehicles.map((v) => ({
    slug: v.slug
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const vehicle = getVehicleByStockIdOrSlug(params.slug);
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found — Makers Corp Japan',
      description: 'The requested vehicle is not available in our current Japanese export inventory.'
    };
  }

  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockId}) — Makers Corp Japan`,
    description: `Export quotation for ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.grade}. Chassis: ${vehicle.modelCode}, Mileage: ${vehicle.mileageKm.toLocaleString()} km, Condition: Grade ${vehicle.conditionGrade}. FOB and CIF quotes available from Tokyo.`,
    openGraph: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} — Makers Corp Japan`,
      description: `Stock: ${vehicle.stockId} · Grade ${vehicle.conditionGrade} · Mileage: ${vehicle.mileageKm.toLocaleString()} km`,
      images: vehicle.images[0] ? [{ url: vehicle.images[0] }] : []
    }
  };
}

export default function VehicleDetailPage({ params }: Props) {
  const vehicle = getVehicleByStockIdOrSlug(params.slug);

  if (!vehicle) {
    notFound();
  }

  return <VehicleDetailClient vehicle={vehicle} />;
}
