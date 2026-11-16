import { MetadataRoute } from 'next';
import { getActiveVehicles } from '@/data/vehicles';
import { getAllPublishedMarkets } from '@/data/destinations';
import { articles } from '@/data/news';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.makerscorpjapan.com';
  const vehicles = getActiveVehicles();
  const markets = getAllPublishedMarkets();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/vehicles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/destinations/asia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/destinations/africa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/how-to-buy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/request-a-vehicle`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${base}/news/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles
    .filter(v => v.availability !== 'Sold')
    .map(v => ({
      url: `${base}/vehicles/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const destinationRoutes: MetadataRoute.Sitemap = markets.map(m => ({
    url: `${base}/destinations/${m.region}/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...newsRoutes, ...vehicleRoutes, ...destinationRoutes];
}
