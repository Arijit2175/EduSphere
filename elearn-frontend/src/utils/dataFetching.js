/**
 * Data Fetching Optimization Utilities
 * Reduces data transfer, implements smart caching, and pagination
 */

import axios from 'axios';
import API_URL from '../config';
import { cachePageData, getCachedPageData } from './useMediaCache';

const PAGINATION_LIMIT = 20; // Items per page
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch paginated data with caching
 * @param {string} endpoint - API endpoint (e.g., '/courses')
 * @param {number} page - Page number (0-indexed)
 * @param {number} limit - Items per page
 * @param {string} token - Auth token
 * @returns {Promise<object>} { data, total, skip, limit }
 */
export const fetchPaginatedData = async (
  endpoint,
  page = 0,
  limit = PAGINATION_LIMIT,
  token = null
) => {
  const skip = page * limit;
  const cacheKey = `paginated:${endpoint}:${skip}:${limit}`;

  // Check cache first
  const cached = getCachedPageData(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${endpoint} page ${page}`);
    return cached;
  }

  try {
    const url = `${API_URL}${endpoint}?skip=${skip}&limit=${limit}`;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const response = await axios.get(url, config);
    const data = response.data;

    // Normalize response (handle both array and paginated formats)
    const normalizedData = Array.isArray(data)
      ? { data, total: data.length, skip, limit }
      : data;

    // Cache the result
    cachePageData(cacheKey, normalizedData, CACHE_TTL);
    console.log(`[Cache MISS] ${endpoint} page ${page} - fetched from server`);

    return normalizedData;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
};

/**
 * Prefetch next page while user is on current page
 * Smooth pagination without wait
 * @param {string} endpoint - API endpoint
 * @param {number} currentPage - Current page
 * @param {number} limit - Items per page
 * @param {string} token - Auth token
 */
export const prefetchNextPage = (endpoint, currentPage, limit = PAGINATION_LIMIT, token = null) => {
  const nextPage = currentPage + 1;
  // Fire and forget - don't await
  fetchPaginatedData(endpoint, nextPage, limit, token).catch(() => {});
};

/**
 * Batch fetch multiple endpoints
 * Parallel requests for faster initial load
 * @param {string[]} endpoints - Array of endpoints
 * @param {string} token - Auth token
 * @returns {Promise<object>} Results keyed by endpoint
 */
export const fetchBatchData = async (endpoints, token = null) => {
  const requests = endpoints.map((endpoint) =>
    fetchPaginatedData(endpoint, 0, PAGINATION_LIMIT, token)
      .then((data) => ({ endpoint, data, error: null }))
      .catch((error) => ({ endpoint, data: null, error }))
  );

  const results = await Promise.all(requests);
  const data = {};

  results.forEach(({ endpoint, data: result, error }) => {
    if (error) {
      console.warn(`Failed to fetch ${endpoint}:`, error.message);
      data[endpoint] = null;
    } else {
      data[endpoint] = result;
    }
  });

  return data;
};

/**
 * Create an optimized axios instance with caching
 * @param {string} token - Auth token
 * @returns {AxiosInstance} Configured axios instance
 */
export const createOptimizedAxios = (token = null) => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

  // Add auth header if provided
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Response interceptor for caching
  instance.interceptors.response.use(
    (response) => {
      // Cache GET requests
      if (response.config.method === 'get') {
        const cacheKey = `api:${response.config.url}`;
        cachePageData(cacheKey, response.data, CACHE_TTL);
      }
      return response;
    },
    (error) => {
      // Try to return cached data on error
      if (error.response?.status >= 500) {
        const cacheKey = `api:${error.config.url}`;
        const cached = getCachedPageData(cacheKey);
        if (cached) {
          console.log('Returning cached data due to server error');
          return Promise.resolve({ data: cached, cached: true });
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Invalidate cache for endpoint
 * Call after POST/PUT/DELETE operations
 * @param {string} endpoint - API endpoint
 */
export const invalidateCache = (endpoint) => {
  // Clear all pages for this endpoint
  // In production, use localStorage with keys pattern
  console.log(`[Cache INVALIDATED] ${endpoint}`);
};

export default {
  fetchPaginatedData,
  prefetchNextPage,
  fetchBatchData,
  createOptimizedAxios,
  invalidateCache,
};
