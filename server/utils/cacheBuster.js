const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Cache Busting Utility
 * Automatically appends version hashes to static assets
 */

class CacheBuster {
  constructor() {
    this.versionMap = new Map();
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  /**
   * Generate hash from file content
   */
  generateHash(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return Date.now().toString(); // Fallback to timestamp
    }
  }

  /**
   * Get versioned URL for a file
   */
  getVersionedUrl(filePath) {
    // In development, always use timestamp for immediate updates
    if (this.isDevelopment) {
      return `${filePath}?v=${Date.now()}`;
    }

    // In production, use content hash for proper caching
    if (!this.versionMap.has(filePath)) {
      const fullPath = path.join(__dirname, '../../client', filePath);
      const hash = this.generateHash(fullPath);
      this.versionMap.set(filePath, hash);
    }

    return `${filePath}?v=${this.versionMap.get(filePath)}`;
  }

  /**
   * Clear version cache (useful for hot reloading)
   */
  clearCache() {
    this.versionMap.clear();
  }

  /**
   * Middleware for Express to add cache headers
   */
  middleware() {
    return (req, res, next) => {
      // Set cache headers based on environment
      if (this.isDevelopment) {
        // No cache in development
        res.set({
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        });
      } else {
        // Long cache in production (files are versioned)
        const fileExt = path.extname(req.url).toLowerCase();
        if (['.css', '.js', '.jpg', '.png', '.gif', '.svg', '.woff', '.woff2'].includes(fileExt)) {
          res.set({
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Expires': new Date(Date.now() + 31536000000).toUTCString()
          });
        }
      }
      next();
    };
  }
}

module.exports = new CacheBuster();
