/**
 * Normalize image URLs stored in the database.
 *
 * Images uploaded through the production server are stored as:
 *   http://makersceylon.com/public/uploads/...
 *
 * The production server only listens on HTTPS, so HTTP URLs time out.
 * This utility upgrades those URLs to HTTPS so they load correctly both
 * locally and in production.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // Upgrade http://makersceylon.com → https://makersceylon.com
  if (url.startsWith('http://makersceylon.com')) {
    return url.replace('http://makersceylon.com', 'https://makersceylon.com');
  }
  if (url.startsWith('http://www.makersceylon.com')) {
    return url.replace('http://www.makersceylon.com', 'https://www.makersceylon.com');
  }

  return url;
}

/**
 * Recursively walk an object and normalize all string values that look like
 * image URLs (ending in common image extensions or containing /uploads/).
 */
export function normalizeSettingsImages<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(normalizeSettingsImages) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string' && (
      value.includes('/uploads/') ||
      /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(value)
    )) {
      result[key] = normalizeImageUrl(value);
    } else if (value && typeof value === 'object') {
      result[key] = normalizeSettingsImages(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
