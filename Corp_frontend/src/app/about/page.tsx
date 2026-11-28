import type { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'About — Makers Corp Japan',
  description:
    'Makers Corp Japan is a vehicle export specialist connecting international buyers to genuine vehicles sourced from Japan. Pre-export inspection, transparent documentation.',
};

export default function AboutPage() {
  return <AboutClient />;
}
