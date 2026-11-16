/**
 * Google Maps URL conversion utility.
 *
 * Supported input formats:
 *  - https://www.google.com/maps/embed?pb=...          → passthrough
 *  - https://www.google.com/maps/embed/v1/...           → passthrough
 *  - https://www.google.com/maps/place/Name/@lat,lng,z  → extract coords → embed
 *  - https://www.google.com/maps/@lat,lng,z             → extract coords → embed
 *  - https://maps.google.com/?q=lat,lng                 → embed
 *  - https://goo.gl/maps/...  or maps.app.goo.gl/...   → resolve server-side first
 */

export type MapUrlStatus = 'embed' | 'share' | 'shortlink' | 'invalid' | 'empty';

export interface MapUrlResult {
  embedUrl: string | null;
  status: MapUrlStatus;
  message: string;
}

/** Extract lat,lng,zoom from a Google Maps full URL path/query */
function extractCoordsEmbed(url: string): string | null {
  // Pattern 1: /@lat,lng,zoomz  (place or direct coord links)
  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+),(\d+)z/);
  if (coordMatch) {
    const [, lat, lng, zoom] = coordMatch;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  }

  // Pattern 2: ?q=lat,lng or ?q=place+name
  try {
    const parsed = new URL(url);
    const q = parsed.searchParams.get('q');
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }
  } catch {
    // ignore
  }

  // Pattern 3: /maps/place/Place+Name  — use place name as query
  const placeMatch = url.match(/\/maps\/(?:embed\/)?(?:place\/([^/@?]+))/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    if (placeName) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
    }
  }

  return null;
}

/**
 * Converts a resolved (non-short) Google Maps URL into an embeddable iframe src.
 * Returns null if conversion is not possible.
 */
export function convertMapUrl(input: string): MapUrlResult {
  const url = (input || '').trim();

  if (!url) {
    return { embedUrl: null, status: 'empty', message: '' };
  }

  // 1. Already an embed URL — use as-is
  if (
    url.startsWith('https://www.google.com/maps/embed') ||
    url.startsWith('http://www.google.com/maps/embed') ||
    url.includes('output=embed')
  ) {
    return {
      embedUrl: url,
      status: 'embed',
      message: '✅ Valid embed URL — ready to use.',
    };
  }

  // 2. Short links — must be resolved server-side before calling this function
  if (url.includes('goo.gl/maps/') || url.includes('maps.app.goo.gl/')) {
    return {
      embedUrl: null,
      status: 'shortlink',
      message: '🔄 Resolving short link...',
    };
  }

  // 3. Validate it is a Google domain
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { embedUrl: null, status: 'invalid', message: '❌ The URL entered is not valid.' };
  }

  const isGoogleDomain =
    parsed.hostname === 'www.google.com' ||
    parsed.hostname === 'google.com' ||
    parsed.hostname === 'maps.google.com' ||
    parsed.hostname.endsWith('.google.com');

  if (!isGoogleDomain || !parsed.pathname.startsWith('/maps')) {
    return {
      embedUrl: null,
      status: 'invalid',
      message: '❌ This does not appear to be a Google Maps URL.',
    };
  }

  // 4. Try to extract coords/place for a clean embed URL
  const coordEmbed = extractCoordsEmbed(url);
  if (coordEmbed) {
    return {
      embedUrl: coordEmbed,
      status: 'share',
      message: '✅ Share link converted — map will display below.',
    };
  }

  // 5. Fallback: inject /embed into the path
  const embedPath = parsed.pathname.replace(/^\/maps/, '/maps/embed');
  const embedUrl = `https://www.google.com${embedPath}${parsed.search}`;

  return {
    embedUrl,
    status: 'share',
    message:
      '✅ Share link detected — if the map does not appear, use the Embed URL instead (Share → Embed a map → copy the src).',
  };
}

export function isValidMapUrl(input: string): boolean {
  const { status } = convertMapUrl(input);
  return status === 'embed' || status === 'share';
}
