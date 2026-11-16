import type { Metadata } from 'next';
import { RequestVehicleClient } from './RequestVehicleClient';

export const metadata: Metadata = {
  title: 'Request a Vehicle — Makers Corp Japan',
  description:
    "Can't find the vehicle you need? Submit your requirements and we'll source it from Japan's auction network and dealer connections.",
};

export default function RequestVehiclePage() {
  return <RequestVehicleClient />;
}
