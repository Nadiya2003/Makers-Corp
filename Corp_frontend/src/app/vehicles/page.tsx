import { Metadata } from 'next';
import { VehiclesClient } from './VehiclesClient';

export const metadata: Metadata = {
  title: 'Japan Vehicle Inventory — Makers Corp Japan',
  description: 'Browse genuine vehicles sourced from Japan. Filter by make, body type, year, mileage and destination. Request a written export quotation.',
};

export default function VehiclesPage() {
  return <VehiclesClient />;
}
