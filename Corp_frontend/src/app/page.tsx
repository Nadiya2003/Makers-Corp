import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { HeroCompactSearch } from '@/components/home/HeroCompactSearch';
import { CampaignBannerStrip } from '@/components/home/CampaignBannerStrip';
import { ShopByType } from '@/components/home/ShopByType';
import { LatestVehiclesSection } from '@/components/home/LatestVehiclesSection';
import { CuratedShelves } from '@/components/home/CuratedShelves';
import { MediaCenterPreview } from '@/components/home/MediaCenterPreview';
import { ShopByDestination } from '@/components/home/ShopByDestination';
import { TrustAndProcess } from '@/components/home/TrustAndProcess';

export default function HomePage() {
  return (
    <main className="w-full">
      {/* 1. Premium Vehicle Hero Carousel */}
      <HeroCarousel />

      {/* 2. Compact search placed directly below hero carousel */}
      <HeroCompactSearch />

      {/* 3. Homepage Campaign Banner Strip (Directly below hero & search) */}
      <CampaignBannerStrip />

      {/* 4. Shop by type (compact chips & tiles) */}
      <ShopByType />

      {/* 5. Latest Vehicles in Japan (Immediate real card grid on initial screen) */}
      <LatestVehiclesSection />

      {/* 6. More ways to shop (Curated shelves) */}
      <CuratedShelves />

      {/* 7. Makers Corp Japan Media Center (News & Reviews Editorial Preview) */}
      <MediaCenterPreview />

      {/* 8. Shop by Destination (India & Sri Lanka featured) */}
      <ShopByDestination />

      {/* 9. Conclude with trust and conversion */}
      <TrustAndProcess />
    </main>
  );
}
