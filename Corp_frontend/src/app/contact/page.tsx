import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact — Makers Corp Japan',
  description:
    'Get in touch with Makers Corp Japan. Export inquiries, destination checks, quotation requests and vehicle sourcing — our desks are ready.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
