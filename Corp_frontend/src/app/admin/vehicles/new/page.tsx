import { Metadata } from 'next';
import { VehicleForm } from '@/components/admin/VehicleForm';

export const metadata: Metadata = {
  title: 'Add New Vehicle — Makers Corp Japan Admin',
  description: 'Add and publish a new vehicle to the Makers Corp Japan export catalog.'
};

export default function NewVehiclePage() {
  return <VehicleForm isEdit={false} />;
}
