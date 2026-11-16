import React from 'react';
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
      {/* 1. Compact opening and search */}
      <HeroCompactSearch />

      {/* 2. Homepage Campaign Banner Strip (Directly below hero & search) */}
      <CampaignBannerStrip />

      {/* 3. Shop by type (compact chips & tiles) */}
      <ShopByType />

      {/* 4. Latest Vehicles in Japan (Immediate real card grid on initial screen) */}
      <LatestVehiclesSection />

      {/* 5. More ways to shop (Curated shelves) */}
      <CuratedShelves />

      {/* 6. Makers Corp Japan Media Center (News & Reviews Editorial Preview) */}
      <MediaCenterPreview />

      {/* 7. Shop by Destination (India & Sri Lanka featured) */}
      <ShopByDestination />

      {/* 8. Conclude with trust and conversion */}
      <TrustAndProcess />
    </main>
  );
}
