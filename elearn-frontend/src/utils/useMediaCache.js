/**
 * useMediaCache Hook
 * Provides in-memory caching for media URLs and page data
 * Dramatically speeds up page reloads and navigation
 */

import { useEffect, useRef } from 'react';

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const pageDataCache = new Map();
const mediaCache = new Map();

class CacheEntry {
  constructor(data) {
    this.data = data;
    this.timestamp = Date.now();
  }

  isExpired() {
    return Date.now() - this.timestamp > CACHE_EXPIRY;
  }
}

/**
 * Cache page data with TTL
 * @param {string} key - Cache key
 * @param {object} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 min)
 */
export const cachePageData = (key, data, ttl = CACHE_EXPIRY) => {
  const entry = new CacheEntry(data);
  pageDataCache.set(key, entry);

  // Auto-expire after TTL
  setTimeout(() => {
    pageDataCache.delete(key);
  }, ttl);
};

/**
 * Get cached page data
 * @param {string} key - Cache key
 * @returns {object|null} Cached data or null if not found/expired
 */
export const getCachedPageData = (key) => {
  const entry = pageDataCache.get(key);
  if (!entry) return null;
  if (entry.isExpired()) {
    pageDataCache.delete(key);
    return null;
  }
  return entry.data;
};

/**
 * Cache media URL (for uploaded images/videos)
 * @param {string} url - Media URL
 */
export const cacheMediaURL = (url) => {
  if (!mediaCache.has(url)) {
    mediaCache.set(url, new CacheEntry(url));
  }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key
 */
export const clearCache = (key) => {
  pageDataCache.delete(key);
};

/**
 * Clear all caches
 */
export const clearAllCaches = () => {
  pageDataCache.clear();
  mediaCache.clear();
};

/**
 * useMediaCache Hook
 * Usage in components:
 * const { cacheData, getData } = useMediaCache('courses');
 */
export const useMediaCache = (cacheKey = 'default') => {
  const cacheKeyRef = useRef(cacheKey);

  useEffect(() => {
    cacheKeyRef.current = cacheKey;
  }, [cacheKey]);

  return {
    cacheData: (data, ttl) => cachePageData(cacheKeyRef.current, data, ttl),
    getData: () => getCachedPageData(cacheKeyRef.current),
    clearCache: () => clearCache(cacheKeyRef.current),
  };
};

/**
 * HTTP Cache Headers Interceptor
 * Add this to your axios instance for better caching
 */
export const setupCacheInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      // Cache successful GET requests
      if (response.config.method === 'get') {
        const cacheKey = `http:${response.config.url}`;
        cachePageData(cacheKey, response.data, 5 * 60 * 1000); // 5 min
      }
      return response;
    },
    (error) => {
      // On error, try to return cached data
      const cacheKey = `http:${error.config.url}`;
      const cached = getCachedPageData(cacheKey);
      if (cached && error.response?.status >= 500) {
        console.log('Returning cached data due to server error');
        return Promise.resolve({ data: cached, cached: true });
      }
      return Promise.reject(error);
    }
  );
};

export default useMediaCache;
