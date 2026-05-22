import { Metadata } from 'next';
import { VehiclesClient } from './VehiclesClient';

export const metadata: Metadata = {
  title: 'Our Vehicles - Makers Ceylon',
  description: 'Explore our full collection of premium Japanese vehicles available for direct import to Sri Lanka.',
};

export default function VehiclesPage() {
  return <VehiclesClient />;
}
