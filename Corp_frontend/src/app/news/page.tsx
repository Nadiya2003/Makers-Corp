import type { Metadata } from 'next';
import { NewsIndexClient } from './NewsIndexClient';

export const metadata: Metadata = {
  title: 'News & Reviews — Makers Corp Japan Media Center',
  description:
    'Vehicle reviews, buying guides, shipment updates, and insights from Japan. Understand auction grading, destination import conformity, and export procedures.',
  openGraph: {
    title: 'News & Reviews — Makers Corp Japan Media Center',
    description:
      'Vehicle reviews, export buying guides, and technical insights direct from Tokyo operations.',
    siteName: 'Makers Corp Japan',
  },
};

export default function NewsPage() {
  return <NewsIndexClient />;
}
