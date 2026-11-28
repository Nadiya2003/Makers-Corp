import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { HeroCompactSearch } from '@/components/home/HeroCompactSearch';
import { CampaignBannerStrip } from '@/components/home/CampaignBannerStrip';
import { VehicleDiscoveryExperience } from '@/components/home/VehicleDiscoveryExperience';
import { LatestVehiclesSection } from '@/components/home/LatestVehiclesSection';
import { PopularModelsSection } from '@/components/home/PopularModelsSection';
import { CustomerReviewsSection } from '@/components/home/CustomerReviewsSection';
import { MediaCenterPreview } from '@/components/home/MediaCenterPreview';
import { ShopByDestination } from '@/components/home/ShopByDestination';
import { TrustAndProcess } from '@/components/home/TrustAndProcess';

export default function HomePage() {
  return (
    <main className="w-full">
      {/* 1. Premium Automatically Moving Hero Carousel (5s interval, smooth transitions) */}
      <HeroCarousel />

      {/* 2. Compact Vehicle Search (Preserved directly below hero carousel) */}
      <HeroCompactSearch />

      {/* 3. Homepage Campaign Banner Strip */}
      <CampaignBannerStrip />

      {/* 4. Complete Vehicle Category Discovery Experience (Vehicles & Commercial Vehicles multi-level discovery) */}
      <VehicleDiscoveryExperience />

      {/* 5. Latest Vehicles in Japan (Physical stock cards) */}
      <LatestVehiclesSection />

      {/* 6. Popular JDM Models (High-demand export vehicles) */}
      <PopularModelsSection />

      {/* 7. Makers Corp Japan Media Center (News & Reviews Editorial Preview) */}
      <MediaCenterPreview />

      {/* 8. Verified Global Customer Reviews & Testimonials */}
      <CustomerReviewsSection />

      {/* 9. Shop by Destination (India & Sri Lanka featured) */}
      <ShopByDestination />

      {/* 10. Conclude with trust and export process */}
      <TrustAndProcess />
    </main>
  );
}
