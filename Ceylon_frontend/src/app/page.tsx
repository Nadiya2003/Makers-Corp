import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles';
import { LiveAuction } from '@/components/home/LiveAuction';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Inquiry } from '@/components/home/Inquiry';
import { PopupModal } from '@/components/PopupModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';

export default function HomePage() {
  return (
    <main className="w-full">
      <PopupModal />
      <FloatingActionButton />
      <Hero />
      <Features />
      <HowItWorks />
      <FeaturedVehicles />
      <LiveAuction />
      <WhyChooseUs />
      <Inquiry />
    </main>
  );
}
