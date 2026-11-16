const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

/**
 * Follow HTTP redirects to resolve a short URL to its final destination.
 * Handles chains up to maxRedirects deep.
 */
function resolveRedirects(url, maxRedirects = 10) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) {
      return resolve(url);
    }

    const lib = url.startsWith('https') ? https : http;

    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      },
      (res) => {
        // Consume response body to free the socket
        res.resume();

        const location = res.headers.location;
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          location
        ) {
          // Handle relative redirects
          let next;
          try {
            next = new URL(location, url).toString();
          } catch {
            next = location;
          }
          resolveRedirects(next, maxRedirects - 1).then(resolve).catch(reject);
        } else {
          resolve(url);
        }
      }
    );

    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.on('error', reject);
  });
}

// @desc   Resolve a Google Maps short URL to its full URL
// @route  GET /api/map-resolve?url=<encoded-url>
// @access Public
router.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: 'url query parameter is required' });
  }

  // Only allow Google Maps domains to prevent abuse
  let parsedInput;
  try {
    parsedInput = new URL(url);
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL format' });
  }

  const allowedHosts = [
    'goo.gl',
    'maps.app.goo.gl',
    'maps.google.com',
    'www.google.com',
    'google.com',
  ];

  if (!allowedHosts.some((h) => parsedInput.hostname === h || parsedInput.hostname.endsWith('.' + h))) {
    return res.status(400).json({ success: false, message: 'Only Google Maps URLs are supported' });
  }

  try {
    const resolvedUrl = await resolveRedirects(url);
    res.json({ success: true, resolvedUrl });
  } catch (error) {
    console.error('Map resolve error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to resolve URL: ' + error.message });
  }
});

module.exports = router;
