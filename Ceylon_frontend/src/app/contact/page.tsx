import type { Metadata } from 'next';
import { ContactUsClient } from './ContactUsClient';

export const metadata: Metadata = {
  title: 'Contact Us — Ceylon Imports',
  description: 'Get in touch with Ceylon Imports. Our team is here to help you import your dream vehicle from Japan.',
};

export default function ContactUsPage() {
  return <ContactUsClient />;
}
