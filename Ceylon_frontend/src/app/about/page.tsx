import type { Metadata } from 'next';
import { AboutUsClient } from './AboutUsClient';

export const metadata: Metadata = {
  title: 'About Us — Ceylon Imports',
  description:
    'Learn about Ceylon Imports — your trusted partner for importing premium Japanese vehicles directly to Sri Lanka. Transparent, cost-effective, and stress-free.',
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
