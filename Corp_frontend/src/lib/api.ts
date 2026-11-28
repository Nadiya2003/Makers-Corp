import { Vehicle, BodyType, FuelType, SteeringType, AvailabilityStatus, SourceType } from '@/data/types';
import { vehicles as staticVehicles, getVehicleByStockIdOrSlug as staticGetVehicle } from '@/data/vehicles';
import { Article, NewsCategory, articles as staticArticles, getArticleBySlug as staticGetArticle } from '@/data/news';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Backend base URL (without /api) for resolving relative image paths from local uploads
const BACKEND_BASE = API_BASE.replace(/\/api$/, '');

/**
 * Resolve an image URL that may be a relative backend path (local upload fallback)
 * e.g. "/public/uploads/vehicles/xxx.jpg" → "http://localhost:5000/public/uploads/vehicles/xxx.jpg"
 */
function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('/public/') || url.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${url}`;
  }
  return url;
}

/**
 * Normalize a vehicle object from the backend API into the frontend Vehicle interface
 */
export function normalizeVehicle(raw: any): Vehicle {
  if (!raw) return staticVehicles[0];

  // Derive ID and Stock ID
  const stockId = raw.stockId || raw.stock_id || 'MCJ-2026-STOCK';
  const id = raw.id || raw._id?.toString() || stockId.toLowerCase();

  // Price FOB handling
  let priceAmount = 35000;
  let departurePort = raw.fobPort || 'FOB Yokohama';

  if (typeof raw.priceUSD === 'number' && raw.priceUSD > 0) {
    priceAmount = raw.priceUSD;
  } else if (raw.priceFOB && typeof raw.priceFOB === 'object' && raw.priceFOB.amount) {
    priceAmount = Number(raw.priceFOB.amount);
    if (raw.priceFOB.port) departurePort = raw.priceFOB.port;
  } else if (typeof raw.priceFOB === 'string') {
    const parsed = parseInt(raw.priceFOB.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) priceAmount = parsed;
  } else if (typeof raw.price === 'string') {
    const parsed = parseInt(raw.price.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) priceAmount = parsed;
  }

  // Mileage handling
  let mileageKm = 15;
  if (typeof raw.mileageKm === 'number') {
    mileageKm = raw.mileageKm;
  } else if (typeof raw.mileage === 'string') {
    const parsed = parseInt(raw.mileage.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) mileageKm = parsed;
  } else if (typeof raw.mileage === 'number') {
    mileageKm = raw.mileage;
  }

  // Engine capacity handling
  let engineCc = 1500;
  if (typeof raw.engineCc === 'number') {
    engineCc = raw.engineCc;
  } else if (typeof raw.engineCapacity === 'string') {
    const parsed = parseInt(raw.engineCapacity.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) engineCc = parsed;
  }

  // Images array handling
  let images: string[] = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    images = raw.images
      .filter((img: any) => typeof img === 'string' && img.trim().length > 0)
      .map(resolveImageUrl);
  }
  if (images.length === 0 && raw.image) {
    images = [resolveImageUrl(raw.image)];
  }
  if (images.length === 0) {
    images = ['/images/vehicle.jpg'];
  }

  // Drivetrain handling
  let drivetrain: '2WD' | '4WD' | 'AWD' = '2WD';
  const rawDrive = String(raw.drivetrain || '').toUpperCase();
  if (rawDrive.includes('4WD')) drivetrain = '4WD';
  else if (rawDrive.includes('AWD')) drivetrain = 'AWD';

  // Steering handling
  let steering: SteeringType = 'RHD';
  const rawSteering = String(raw.steering || '').toUpperCase();
  if (rawSteering.includes('LHD') || rawSteering.includes('LEFT')) steering = 'LHD';

  // Body Type mapping
  let bodyType: BodyType = 'SUVs & 4x4';
  const rawBody = String(raw.bodyType || raw.category || '').toLowerCase();
  if (rawBody.includes('suv') || rawBody.includes('4x4')) bodyType = 'SUVs & 4x4';
  else if (rawBody.includes('luxury') || rawBody.includes('performance') || rawBody.includes('sport')) bodyType = 'Luxury & Performance';
  else if (rawBody.includes('van') || rawBody.includes('mpv')) bodyType = 'Vans & MPVs';
  else if (rawBody.includes('truck') || rawBody.includes('commercial')) bodyType = 'Trucks & Commercial';
  else if (rawBody.includes('sedan') || rawBody.includes('hatchback')) bodyType = 'Sedans & Hatchbacks';
  else if (rawBody.includes('kei')) bodyType = 'Kei Cars';

  // Fuel Type mapping
  let fuel: FuelType = 'Petrol';
  const rawFuel = String(raw.fuel || '').toLowerCase();
  if (rawFuel.includes('diesel')) fuel = 'Diesel';
  else if (rawFuel.includes('plug-in')) fuel = 'Plug-in Hybrid';
  else if (rawFuel.includes('hybrid')) fuel = 'Hybrid';
  else if (rawFuel.includes('electric') || rawFuel.includes('ev')) fuel = 'Electric';

  // Availability
  let availability: AvailabilityStatus = 'Available';
  const rawAvail = String(raw.availability || raw.status || '').toLowerCase();
  if (rawAvail.includes('sold')) availability = 'Sold';
  else if (rawAvail.includes('reserve')) availability = 'Reserved';

  // Slug fallback
  const slug = raw.slug || `${raw.year || 2026}-${raw.make || 'toyota'}-${raw.model || 'vehicle'}-${stockId}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id,
    stockId,
    slug,
    make: raw.make || 'Toyota',
    model: raw.model || 'Vehicle',
    grade: raw.grade || raw.modelCode || 'Standard',
    modelCode: raw.modelCode || 'JDM-SPEC',
    year: Number(raw.year) || 2026,
    firstRegistrationDate: raw.firstRegistrationDate || `${raw.year || 2026}/01`,
    mileageKm,
    fuel,
    transmission: (raw.transmission as any) || 'Automatic',
    engineCc,
    drivetrain,
    steering,
    bodyType,
    seats: Number(raw.seats) || 5,
    color: raw.color || raw.exteriorColor || 'Pearl White',
    conditionGrade: raw.conditionGrade || 'S/A (Brand New)',
    inspectionStatus: raw.inspectionStatus || 'Makers Certified 150-Point & JEVIC Passed',
    auctionSheetUrl: raw.auctionSheetUrl,
    sourceType: (raw.sourceType as SourceType) || 'Confirmed Makers Inventory',
    availability,
    lastAvailabilityCheck: raw.lastAvailabilityCheck || new Date().toISOString(),
    priceFOB: {
      amount: priceAmount,
      currency: 'USD',
      port: departurePort
    },
    referencePriceLKR: raw.referencePriceLKR,
    images,
    keyFeatures: Array.isArray(raw.keyFeatures) && raw.keyFeatures.length > 0
      ? raw.keyFeatures
      : [
          'Genuine Japanese vehicle sourcing',
          'Competitive sourcing prices',
          'Transparent import process',
          'Vehicle selection and inspection in Japan'
        ],
    overview: raw.overview || `${raw.year || 2026} ${raw.make || ''} ${raw.model || ''} direct export from Japan.`,
    isFeatured: Boolean(raw.isFeatured)
  };
}

/**
 * Normalize an article object from the backend API into the frontend Article interface
 */
export function normalizeArticle(raw: any): Article {
  if (!raw) return staticArticles[0];

  const categoryMap: Record<string, NewsCategory> = {
    'BUYING GUIDES': 'Buying Guides',
    'VEHICLE REVIEWS': 'Vehicle Reviews',
    'COUNTRY GUIDES': 'Country Guides',
    'SHIPMENT UPDATES': 'Shipment Updates',
    'COMPANY NEWS': 'Company News',
    'BUYING_GUIDES': 'Buying Guides',
    'VEHICLE_REVIEWS': 'Vehicle Reviews',
    'EXPORT PROCESS': 'Buying Guides',
    'MARKET UPDATES': 'Shipment Updates'
  };

  const rawCat = String(raw.category || '').toUpperCase();
  const category: NewsCategory = categoryMap[rawCat] || 'Buying Guides';

  let content: string[] = [];
  if (Array.isArray(raw.content)) {
    content = raw.content;
  } else if (typeof raw.content === 'string') {
    content = raw.content.split('\n\n').filter(Boolean);
  }

  let readTimeMinutes = 5;
  if (typeof raw.readTimeMinutes === 'number') {
    readTimeMinutes = raw.readTimeMinutes;
  } else if (typeof raw.readTime === 'string') {
    const parsed = parseInt(raw.readTime.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) readTimeMinutes = parsed;
  }

  let publishedAt = new Date().toISOString().split('T')[0];
  if (raw.publishedAt) {
    publishedAt = new Date(raw.publishedAt).toISOString().split('T')[0];
  }

  return {
    id: raw.id || raw._id?.toString() || raw.slug,
    slug: raw.slug || 'article',
    title: raw.title || 'Makers Corp Japan Export Guide',
    subtitle: raw.subtitle,
    category,
    excerpt: raw.excerpt || '',
    content: content.length > 0 ? content : [raw.excerpt || 'Article content details.'],
    keyTakeaways: Array.isArray(raw.keyTakeaways) ? raw.keyTakeaways : undefined,
    coverImage: raw.coverImage || '/images/Japan Vehicle Export Guide.png',
    author: {
      name: raw.author?.name || 'Kenji Takahashi',
      role: raw.author?.role || 'Export Operations Desk, Tokyo'
    },
    publishedAt,
    readTimeMinutes,
    featured: Boolean(raw.isFeatured || raw.featured)
  };
}

/**
 * Fetch all vehicles with backend API call, seamlessly falling back to static vehicles
 */
export async function fetchLiveVehicles(): Promise<Vehicle[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/vehicles`, {
      cache: 'no-store',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(normalizeVehicle);
      }
    }
  } catch (err) {
    // Graceful fallback
  }
  return staticVehicles;
}

/**
 * Fetch a single vehicle by ID, slug or stockId
 */
export async function fetchLiveVehicle(slugOrId: string): Promise<Vehicle | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/vehicles/${encodeURIComponent(slugOrId)}`, {
      cache: 'no-store',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data) {
        return normalizeVehicle(data.data);
      }
    }
  } catch (err) {
    // Fallback
  }
  return staticGetVehicle(slugOrId);
}

/**
 * Fetch all published articles with backend API call, falling back to static articles
 */
export async function fetchLiveArticles(): Promise<Article[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/articles`, {
      cache: 'no-store',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(normalizeArticle);
      }
    }
  } catch (err) {
    // Graceful fallback
  }
  return staticArticles;
}

/**
 * Fetch a single article by slug or ID
 */
export async function fetchLiveArticle(slugOrId: string): Promise<Article | undefined> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(slugOrId)}`, {
      cache: 'no-store',
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timer);

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data) {
        return normalizeArticle(data.data);
      }
    }
  } catch (err) {
    // Fallback
  }
  return staticGetArticle(slugOrId);
}

